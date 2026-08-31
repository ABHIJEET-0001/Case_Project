#!/usr/bin/env python3
"""
Ethical Indian judgment scraper starter for CaseLens.

This script is intentionally conservative:
- checks robots.txt before crawling (default enabled)
- uses request pacing with jitter
- retries transient HTTP failures
- keeps checkpoint of seen URLs
- writes append-only JSONL

Before using any source, verify Terms of Use and legal permissions.
"""

from __future__ import annotations

import argparse
import json
import random
import re
import sys
import time
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable
from urllib.parse import quote_plus, urljoin, urlparse
from urllib.robotparser import RobotFileParser

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry


@dataclass
class CrawlConfig:
    base_url: str
    query: str
    max_pages: int
    delay_seconds: float
    jitter_seconds: float
    timeout_seconds: int
    output_path: Path
    checkpoint_path: Path
    user_agent: str
    respect_robots: bool


class EthicalJudgmentScraper:
    def __init__(self, base_url: str, config: CrawlConfig):
        self.base_url = base_url.rstrip("/")
        self.config = config
        self.session = self._build_session()
        self.robot_parser = self._build_robot_parser()
        self.seen_urls = self._load_seen_urls()

    def _build_session(self) -> requests.Session:
        session = requests.Session()
        retry = Retry(
            total=4,
            connect=3,
            read=3,
            status=4,
            backoff_factor=1.0,
            status_forcelist=(429, 500, 502, 503, 504),
            allowed_methods=("GET",),
        )
        adapter = HTTPAdapter(max_retries=retry)
        session.mount("http://", adapter)
        session.mount("https://", adapter)
        session.headers.update({"User-Agent": self.config.user_agent})
        return session

    def _build_robot_parser(self) -> RobotFileParser | None:
        if not self.config.respect_robots:
            return None

        robots_url = urljoin(self.base_url + "/", "robots.txt")
        parser = RobotFileParser()
        parser.set_url(robots_url)
        try:
            parser.read()
            return parser
        except Exception as exc:
            print(f"[WARN] Could not read robots.txt: {exc}")
            return None

    def _allowed_by_robots(self, url: str) -> bool:
        if self.robot_parser is None:
            return True
        return self.robot_parser.can_fetch(self.config.user_agent, url)

    def _load_seen_urls(self) -> set[str]:
        path = self.config.checkpoint_path
        if not path.exists():
            return set()
        return {line.strip() for line in path.read_text(encoding="utf-8").splitlines() if line.strip()}

    def _save_seen_url(self, url: str) -> None:
        self.config.checkpoint_path.parent.mkdir(parents=True, exist_ok=True)
        with self.config.checkpoint_path.open("a", encoding="utf-8") as f:
            f.write(url + "\n")

    def _sleep_paced(self) -> None:
        base = self.config.delay_seconds
        jitter = random.uniform(0, self.config.jitter_seconds)
        time.sleep(base + jitter)

    def _request_html(self, url: str) -> str | None:
        if not self._allowed_by_robots(url):
            print(f"[SKIP] Disallowed by robots.txt: {url}")
            return None

        try:
            response = self.session.get(url, timeout=self.config.timeout_seconds)
            if response.status_code >= 400:
                print(f"[WARN] HTTP {response.status_code}: {url}")
                return None
            return response.text
        except requests.RequestException as exc:
            print(f"[WARN] Request failed: {url} ({exc})")
            return None
        finally:
            self._sleep_paced()

    def _search_url(self, page_num: int) -> str:
        encoded_query = quote_plus(self.config.query)
        return f"{self.base_url}/search/?formInput={encoded_query}&pagenum={page_num}"

    def _extract_candidate_links(self, html: str) -> list[str]:
        soup = BeautifulSoup(html, "html.parser")
        candidates: list[str] = []

        for a in soup.select("a[href]"):
            href = a.get("href", "")
            if not href:
                continue
            full_url = urljoin(self.base_url + "/", href)
            parsed = urlparse(full_url)

            # Conservative filter for likely judgment pages.
            if "/doc/" in parsed.path:
                candidates.append(full_url)

        # Preserve order while removing duplicates.
        seen = set()
        unique = []
        for url in candidates:
            if url in seen:
                continue
            seen.add(url)
            unique.append(url)
        return unique

    def _extract_text(self, soup: BeautifulSoup) -> str:
        selectors = [
            "div.judgments",
            "div.judgment",
            "div#judgement",
            "div#judgment",
            "pre#pre_tag",
            "pre",
            "article",
            "main",
        ]

        for selector in selectors:
            node = soup.select_one(selector)
            if node:
                text = node.get_text("\n", strip=True)
                if len(text) > 400:
                    return text

        body = soup.body.get_text("\n", strip=True) if soup.body else ""
        return body

    def _extract_case_id(self, title: str) -> str:
        # Generic case-id pattern fallback.
        match = re.search(r"([A-Za-z()./\-]{2,}\s*\d{1,6}/\d{4})", title)
        return match.group(1).strip() if match else ""

    def _parse_judgment(self, url: str, html: str) -> dict:
        soup = BeautifulSoup(html, "html.parser")

        title_node = soup.select_one("h1")
        title = title_node.get_text(" ", strip=True) if title_node else ""

        text = self._extract_text(soup)
        case_id = self._extract_case_id(title)

        # Optional loose metadata extraction.
        court = ""
        bench = ""
        judges = ""
        date = ""

        page_text = soup.get_text("\n", strip=True)
        court_match = re.search(r"(Supreme Court|High Court|District Court)[^\n]*", page_text, flags=re.IGNORECASE)
        if court_match:
            court = court_match.group(1).strip()

        date_match = re.search(r"\b(\d{1,2}\s+[A-Za-z]+\s+\d{4})\b", page_text)
        if date_match:
            date = date_match.group(1)

        return {
            "source": urlparse(self.base_url).netloc,
            "source_url": url,
            "case_id": case_id,
            "title": title,
            "court": court,
            "bench": bench,
            "date": date,
            "judges": judges,
            "cited_sections": [],
            "judgment_text": text,
            "scraped_at": datetime.now(timezone.utc).isoformat(),
        }

    def _write_jsonl(self, record: dict) -> None:
        self.config.output_path.parent.mkdir(parents=True, exist_ok=True)
        with self.config.output_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

    def crawl(self) -> None:
        total_records = 0
        print(f"[INFO] Query: {self.config.query}")
        print(f"[INFO] Max pages: {self.config.max_pages}")

        for page_num in range(1, self.config.max_pages + 1):
            search_url = self._search_url(page_num)
            print(f"[INFO] Fetching search page {page_num}: {search_url}")
            html = self._request_html(search_url)
            if not html:
                continue

            links = self._extract_candidate_links(html)
            print(f"[INFO] Found {len(links)} candidate links on page {page_num}")

            for url in links:
                if url in self.seen_urls:
                    continue

                doc_html = self._request_html(url)
                if not doc_html:
                    continue

                record = self._parse_judgment(url, doc_html)

                # Minimal quality gate.
                if not record["title"] and not record["case_id"]:
                    continue
                if len(record["judgment_text"]) < 500:
                    continue

                self._write_jsonl(record)
                self.seen_urls.add(url)
                self._save_seen_url(url)
                total_records += 1

                if total_records % 20 == 0:
                    print(f"[INFO] Saved records: {total_records}")

        print(f"[DONE] Total records saved: {total_records}")


def parse_args(argv: Iterable[str]) -> CrawlConfig:
    parser = argparse.ArgumentParser(description="Ethical scraper for Indian legal judgments")
    parser.add_argument("--base-url", default="https://indiankanoon.org", help="Base source URL")
    parser.add_argument("--query", required=True, help="Search query")
    parser.add_argument("--max-pages", type=int, default=3, help="Max search pages to crawl")
    parser.add_argument("--delay-seconds", type=float, default=2.5, help="Base delay between requests")
    parser.add_argument("--jitter-seconds", type=float, default=1.0, help="Random jitter added to delay")
    parser.add_argument("--timeout-seconds", type=int, default=20, help="HTTP timeout")
    parser.add_argument("--output", default="data/judgments_raw.jsonl", help="Output JSONL path")
    parser.add_argument("--checkpoint", default="data/checkpoint_seen_urls.txt", help="Seen-URL checkpoint path")
    parser.add_argument(
        "--user-agent",
        default="CaseLensResearchBot/1.0 (contact: youremail@example.com)",
        help="User-Agent string with contact",
    )
    parser.add_argument(
        "--no-robots",
        action="store_true",
        help="Disable robots.txt checks (not recommended)",
    )

    args = parser.parse_args(list(argv))

    return CrawlConfig(
        base_url=args.base_url,
        query=args.query,
        max_pages=max(1, args.max_pages),
        delay_seconds=max(0.0, args.delay_seconds),
        jitter_seconds=max(0.0, args.jitter_seconds),
        timeout_seconds=max(5, args.timeout_seconds),
        output_path=Path(args.output),
        checkpoint_path=Path(args.checkpoint),
        user_agent=args.user_agent,
        respect_robots=not args.no_robots,
    )


def main(argv: Iterable[str]) -> int:
    config = parse_args(argv)
    scraper = EthicalJudgmentScraper(base_url=config.base_url, config=config)
    scraper.crawl()
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
