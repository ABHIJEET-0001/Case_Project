# Phase 2: Data Pipeline (Weeks 1-2)

This document defines a safe and practical plan for collecting Indian judgment data for CaseLens.

## 1) Data Source Strategy

Use a tiered strategy instead of relying on one source.

1. Primary source: Public legal portals with clear public access.
2. Secondary source: Subscription or partner datasets (if licensed).
3. Backup source: Academic/legal NLP datasets for model warm-up.

Important:
- Always validate Terms of Use for each site.
- Always respect robots.txt and crawl policies.
- Do not bypass access controls or authentication barriers.

## 2) Week-by-Week Execution

### Week 1

1. Finalize target courts and date range.
2. Define metadata schema.
3. Build and test ethical scraper on a small sample (100 to 500 judgments).
4. Add deduplication and checkpointing.

### Week 2

1. Scale crawl with conservative request pacing.
2. Run data quality checks.
3. Normalize fields and persist to JSONL/CSV/PostgreSQL.
4. Build train/validation index snapshot for later embedding generation.

## 3) Minimal Data Schema

Store compact, query-friendly metadata first.

- source
- source_url
- case_id
- title
- court
- bench
- date
- judges
- cited_sections
- judgment_text
- scraped_at

## 4) Ethical Scraping Checklist

Before each run:

1. Confirm robots.txt allows the path.
2. Keep delay between requests (2 to 4 seconds baseline).
3. Add random jitter to avoid burst patterns.
4. Use a clear User-Agent with contact email.
5. Retry with backoff for transient errors only.
6. Stop on repeated 403/429/503 spikes.
7. Do not scrape personal data beyond public legal content needed for the project.

## 5) Storage Guidance

For MVP:

1. Raw output: JSONL file for append-only ingestion.
2. Processed data: PostgreSQL table for metadata.
3. Text body: either PostgreSQL TEXT column or object storage file reference.

Suggested pipeline:

- scrape_raw.jsonl -> clean_normalized.jsonl -> db_ingest -> embeddings

## 6) Runbook

Use the script in scripts/ethical_judgment_scraper.py.

Example:

python scripts/ethical_judgment_scraper.py ^
  --query "bail under section 439" ^
  --max-pages 5 ^
  --delay-seconds 2.5 ^
  --output data/judgments_raw.jsonl ^
  --checkpoint data/checkpoint_seen_urls.txt

Then inspect output quality and increase pages gradually.

## 7) Quality Validation Rules

Reject records where:

1. title missing and case_id missing
2. judgment_text too short (less than 500 chars)
3. duplicate source_url already seen

Flag records for review where:

1. date format invalid
2. court missing
3. likely OCR noise ratio too high

## 8) Next Phase Hand-off

When this phase is complete, provide these artifacts to Phase 3:

1. Final normalized dataset file
2. Source coverage report
3. Court/date distribution summary
4. Deduplication stats
5. Crawl logs with error rates
