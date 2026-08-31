import { useState } from "react";

const QUERIES = [
  { text: "Bail in NDPS cases where commercial quantity seized", tags: ["NDPS", "Bail"] },
  { text: "Habeas corpus detention beyond 60 days CrPC Section 167", tags: ["Liberty", "CrPC"] },
  { text: "Property dispute Hindu Succession Act daughters' rights post-2005", tags: ["Succession", "Property"] },
  { text: "Anticipatory bail corruption cases public servants", tags: ["Bail", "Corruption"] },
];

const RESULTS = [
  {
    id: 1,
    relevance: 98,
    cited: 2847,
    year: "2022",
    date: "11 Jul 2022",
    citation: "(2022) 10 SCC 51",
    case: "Satender Kumar Antil vs. Central Bureau of Investigation",
    court: "Supreme Court of India",
    bench: "Constitutional Bench (5J)",
    judges: "Sanjay Kishan Kaul, MM Sundresh JJ",
    summary:
      "Landmark judgment laying down a comprehensive framework for granting bail. The Court held that bail is the rule, jail the exception, and directed courts not to mechanically refuse bail.",
    keyHolding:
      "Bail is rule, jail is exception. Courts must apply mind to facts, not mechanically refuse bail based on gravity alone.",
    acts: ["CrPC Section 437", "CrPC Section 439", "CrPC Section 167"],
    tags: ["Bail Jurisprudence", "Personal Liberty", "Art. 21"],
  },
  {
    id: 2,
    relevance: 94,
    cited: 1203,
    year: "2020",
    date: "27 Nov 2020",
    citation: "(2021) 2 SCC 427",
    case: "Arnab Manoranjan Goswami vs. State of Maharashtra",
    court: "Supreme Court of India",
    bench: "Division Bench (2J)",
    judges: "DY Chandrachud, Indira Banerjee JJ",
    summary:
      "The Supreme Court granted interim bail observing that personal liberty cannot be curtailed lightly and courts must not avoid interim protections.",
    keyHolding:
      "High Courts cannot abdicate their duty to protect personal liberty. Mechanical dismissal of bail applications is impermissible.",
    acts: ["Art. 21", "Art. 136", "CrPC Section 438"],
    tags: ["Personal Liberty", "Habeas Corpus", "Anticipatory Bail"],
  },
  {
    id: 3,
    relevance: 87,
    cited: 3412,
    year: "2011",
    date: "23 Nov 2011",
    citation: "(2012) 1 SCC 40",
    case: "Sanjay Chandra vs. Central Bureau of Investigation",
    court: "Supreme Court of India",
    bench: "Division Bench (2J)",
    judges: "GS Singhvi, Asok Kumar Ganguly JJ",
    summary:
      "In the 2G spectrum case, the Court granted bail to accused and emphasized that denial of bail cannot become pre-trial punishment.",
    keyHolding:
      "Purpose of bail is to ensure trial attendance, not punishment before conviction.",
    acts: ["Art. 21", "CrPC Section 439", "IPC Section 420"],
    tags: ["Economic Offences", "Bail", "Pre-trial Detention"],
  },
];

const AI_ANALYSIS = [
  { bold: false, text: "Based on current Supreme Court position, this query is governed by the NDPS twin-condition framework under Section 37. " },
  { bold: true, text: "Governing provision: " },
  {
    bold: false,
    text: "Bail requires satisfaction that the accused is prima facie not guilty and unlikely to commit further offence while on bail. ",
  },
  { bold: true, text: "Post-2022 position: " },
  {
    bold: false,
    text: "Satender Kumar Antil softened mechanical rejection by requiring reasoned prima facie scrutiny and proportional liberty protection.",
  },
];

const COURTS = ["All Courts", "Supreme Court", "High Courts", "Tribunals"];
const YEARS = ["Last 5 years", "Last 10 years", "All time"];
const SORTS = ["Relevance", "Date (newest)", "Most cited"];

export default function CaseSearch() {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [searchedQ, setSearchedQ] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [court, setCourt] = useState("All Courts");
  const [year, setYear] = useState("Last 5 years");
  const [sort, setSort] = useState("Relevance");

  const doSearch = (q?: string) => {
    const raw = (q ?? query).trim();
    const sq = raw || QUERIES[0].text;
    setQuery(sq);
    setSearchedQ(sq);
    setLoading(true);
    setSearched(false);
    setSelectedId(null);
    setStep(0);
    [400, 850, 1300].forEach((ms, i) => setTimeout(() => setStep(i + 1), ms));
    setTimeout(() => {
      setLoading(false);
      setSearched(true);
    }, 1600);
  };

  const sorted = [...RESULTS].sort((a, b) =>
    sort === "Most cited" ? b.cited - a.cited : sort === "Date (newest)" ? +b.year - +a.year : b.relevance - a.relevance,
  );

  const filterBtn = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        padding: "5px 11px",
        borderRadius: "999px",
        fontSize: "11.5px",
        fontWeight: 600,
        cursor: "pointer",
        background: active ? "#0f172a" : "white",
        color: active ? "white" : "#64748b",
        border: `1px solid ${active ? "#0f172a" : "#e2e8f0"}`,
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="view-enter page-shell">
      <div className="page-head flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Precedent Search</h1>
          <p className="mt-1 text-xs text-slate-500">AI-powered retrieval across 4.2M+ Indian court judgments</p>
        </div>
        <div className="hidden items-center gap-2 text-xs text-slate-400 md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Index live · updated 2 minutes ago
        </div>
      </div>

      <div className="px-4 pt-4 md:px-7">
        <div className="surface-elevated flex items-center gap-2 p-3">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="7" cy="7" r="5" stroke="#94a3b8" strokeWidth="1.5" />
            <path d="M11 11L14 14" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doSearch()}
            placeholder="Ask a legal question or describe the precedent you need..."
            autoFocus
            className="flex-1 border-none bg-transparent text-sm text-slate-900 outline-none"
          />
          <button
            onClick={() => doSearch()}
            className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white"
          >
            Search
          </button>
        </div>

        {!query.trim() && (
          <p className="mt-2 text-xs text-slate-500">
            Search will auto-run a recommended precedent query if you keep this empty.
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {COURTS.map((f) => filterBtn(f, court === f, () => setCourt(f)))}
          <span className="mx-1 h-4 w-px bg-slate-200" />
          {YEARS.map((f) => filterBtn(f, year === f, () => setYear(f)))}
        </div>
      </div>

      <div className="page-content" style={{ paddingTop: "10px" }}>
        {!searched && !loading && (
          <div>
            <div className="mb-3 mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Suggested Searches</div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {QUERIES.map((q) => (
                <button key={q.text} onClick={() => doSearch(q.text)} className="surface-elevated rounded-xl p-4 text-left">
                  <div className="text-sm font-semibold text-slate-700">{q.text}</div>
                  <div className="mt-2 flex gap-1.5">
                    {q.tags.map((t) => (
                      <span key={t} className="rounded-full bg-teal-50 px-2 py-0.5 text-[10px] font-semibold text-teal-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="surface-elevated mt-3 rounded-2xl p-5">
            <div className="mb-4 flex items-center gap-2">
              <div className="spin h-4 w-4 rounded-full border-2 border-teal-700 border-t-transparent" />
              <div className="text-sm font-semibold text-slate-800">Searching 4.2M+ judgments</div>
            </div>
            {["Analyzing legal context", "Retrieving ranked precedents", "Synthesizing AI legal analysis"].map((label, i) => (
              <div key={label} className="mb-2 flex items-center gap-2 text-sm">
                <span className={`h-2 w-2 rounded-full ${step >= i + 1 ? "bg-teal-600" : "bg-slate-300"}`} />
                <span className={step >= i + 1 ? "text-slate-700" : "text-slate-400"}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {searched && (
          <div className="mt-2 flex flex-col gap-4 xl:flex-row xl:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <div className="surface-elevated overflow-hidden">
                <div className="flex items-center gap-2 border-b border-indigo-100 bg-gradient-to-r from-indigo-50 to-cyan-50 px-4 py-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-indigo-700">AI Legal Analysis</span>
                  <span className="ml-auto text-xs text-indigo-500">{searchedQ.slice(0, 48)}</span>
                </div>
                <div className="p-4 text-sm leading-7 text-slate-700">
                  {AI_ANALYSIS.map((p, i) => (p.bold ? <strong key={i}>{p.text}</strong> : <span key={i}>{p.text}</span>))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-700">
                  {RESULTS.length} precedents <span className="font-normal text-slate-400">· {court} · {year}</span>
                </span>
                <div className="flex items-center gap-1.5">
                  {SORTS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSort(s)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${sort === s ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {sorted.map((r) => {
                const selected = selectedId === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setSelectedId(selected ? null : r.id)}
                    className="surface-elevated cursor-pointer overflow-hidden"
                    style={{ borderColor: selected ? "#14b8a6" : "#e5e7eb", boxShadow: selected ? "0 0 0 3px rgba(20,184,166,0.14)" : undefined }}
                  >
                    <div className="h-1" style={{ background: `linear-gradient(90deg,#14b8a6 ${r.relevance}%,#e2e8f0 ${r.relevance}%)` }} />
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-400">{r.citation}</span>
                            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">{r.relevance}% match</span>
                          </div>
                          <h3 className="truncate text-sm font-bold tracking-tight text-slate-900">{r.case}</h3>
                          <div className="mt-1 text-xs text-slate-500">{r.court} · {r.bench}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-extrabold tracking-tight text-slate-900">{r.cited.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">citations</div>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">{r.summary}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedId !== null && (() => {
              const r = RESULTS.find((x) => x.id === selectedId);
              if (!r) return null;
              return (
                <div className="surface-elevated w-full xl:sticky xl:top-0 xl:w-[340px] xl:flex-shrink-0">
                  <div className="border-b border-slate-100 p-4">
                    <div className="font-mono text-[10px] text-slate-400">{r.citation}</div>
                    <h3 className="mt-1 text-sm font-bold tracking-tight text-slate-900">{r.case}</h3>
                  </div>
                  <div className="p-4">
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                      <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-amber-800">Key Holding</div>
                      <p className="text-xs text-amber-900">{r.keyHolding}</p>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{r.summary}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
