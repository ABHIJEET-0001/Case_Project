import { useState } from "react";

const QUERIES = [
  { text: "Bail in NDPS cases where commercial quantity seized", tags: ["NDPS", "Bail"] },
  { text: "Habeas corpus — detention beyond 60 days CrPC §167", tags: ["Liberty", "CrPC"] },
  { text: "Property dispute — Hindu Succession Act daughters' rights post-2005", tags: ["Succession", "Property"] },
  { text: "Anticipatory bail — corruption cases, public servants", tags: ["Bail", "Corruption"] },
];

const RESULTS = [
  {
    id: 1, relevance: 98, cited: 2847, year: "2022", date: "11 Jul 2022",
    citation: "(2022) 10 SCC 51",
    case: "Satender Kumar Antil vs. Central Bureau of Investigation",
    court: "Supreme Court of India", bench: "Constitutional Bench (5J)",
    judges: "Sanjay Kishan Kaul, MM Sundresh JJ",
    summary: "Landmark judgment laying down a comprehensive framework for granting bail. The Court held that bail is the rule, jail the exception, and directed courts not to mechanically refuse bail. Categorized offences into four groups and provided specific guidelines for each.",
    keyHolding: "Bail is rule, jail is exception. Courts must apply mind to facts, not mechanically refuse bail based on gravity of offence alone.",
    acts: ["CrPC §437", "CrPC §439", "CrPC §167"],
    tags: ["Bail Jurisprudence", "Personal Liberty", "Art. 21"],
  },
  {
    id: 2, relevance: 94, cited: 1203, year: "2020", date: "27 Nov 2020",
    citation: "(2021) 2 SCC 427",
    case: "Arnab Manoranjan Goswami vs. State of Maharashtra",
    court: "Supreme Court of India", bench: "Division Bench (2J)",
    judges: "DY Chandrachud, Indira Banerjee JJ",
    summary: "The Supreme Court granted interim bail observing that the High Court's approach of not granting interim relief in a matter involving personal liberty was erroneous. The Court emphasized that personal liberty cannot be curtailed lightly.",
    keyHolding: "High Courts cannot abdicate their duty to protect personal liberty. Mechanical dismissal of bail applications is impermissible.",
    acts: ["Art. 21", "Art. 136", "CrPC §438"],
    tags: ["Personal Liberty", "Habeas Corpus", "Anticipatory Bail"],
  },
  {
    id: 3, relevance: 87, cited: 3412, year: "2011", date: "23 Nov 2011",
    citation: "(2012) 1 SCC 40",
    case: "Sanjay Chandra vs. Central Bureau of Investigation",
    court: "Supreme Court of India", bench: "Division Bench (2J)",
    judges: "GS Singhvi, Asok Kumar Ganguly JJ",
    summary: "In the 2G spectrum case, the Court granted bail to the accused while emphasizing that denial of bail is punitive, not preventive. Prolonged incarceration before conviction violates Art. 21.",
    keyHolding: "Bail should not be refused as punishment. Purpose of bail is to ensure appearance at trial, not punish accused.",
    acts: ["Art. 21", "CrPC §439", "IPC §420"],
    tags: ["Economic Offences", "Bail", "Pre-trial Detention"],
  },
];

const AI_ANALYSIS = [
  { bold: false, text: "Based on the current Supreme Court position on bail in NDPS cases involving commercial quantity, the following framework applies:\n\n" },
  { bold: true,  text: "Governing provision: " },
  { bold: false, text: "Section 37 of the NDPS Act creates a twin-condition bar — bail can only be granted if the court is satisfied there are reasonable grounds to believe the accused is not guilty, and he is not likely to commit any offence on bail.\n\n" },
  { bold: true,  text: "Post-2022 position: " },
  { bold: false, text: "Satender Kumar Antil (2022) has partially softened the absolute bar through its four-category classification framework, requiring courts to prima facie assess evidence rather than apply the restriction mechanically." },
];

const COURTS = ["All Courts", "Supreme Court", "High Courts", "Tribunals"];
const YEARS  = ["Last 5 years", "Last 10 years", "All time"];
const SORTS  = ["Relevance", "Date (newest)", "Most cited"];

const S = {
  page:       { display: "flex", flexDirection: "column" as const, height: "100%", background: "#F4F5F7" },
  topbar:     { background: "white", borderBottom: "1px solid #E8EAED", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 as const },
  heading:    { fontSize: "16px", fontWeight: 700, color: "#0D1117", letterSpacing: "-0.3px", margin: 0 },
  sub:        { fontSize: "12px", color: "#8C929A", margin: "3px 0 0" },
};

export default function CaseSearch() {
  const [query, setQuery]           = useState("");
  const [searched, setSearched]     = useState(false);
  const [loading, setLoading]       = useState(false);
  const [step, setStep]             = useState(0);
  const [searchedQ, setSearchedQ]   = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [court, setCourt]           = useState("All Courts");
  const [year, setYear]             = useState("Last 5 years");
  const [sort, setSort]             = useState("Relevance");

  const doSearch = (q?: string) => {
    const sq = (q ?? query).trim();
    if (!sq) return;
    setQuery(sq);
    setSearchedQ(sq);
    setLoading(true);
    setSearched(false);
    setSelectedId(null);
    setStep(0);
    [400, 850, 1300].forEach((ms, i) => setTimeout(() => setStep(i + 1), ms));
    setTimeout(() => { setLoading(false); setSearched(true); }, 1600);
  };

  const sorted = [...RESULTS].sort((a, b) =>
    sort === "Most cited" ? b.cited - a.cited :
    sort === "Date (newest)" ? +b.year - +a.year : b.relevance - a.relevance
  );

  const filterBtn = (label: string, active: boolean, onClick: () => void) => (
    <button key={label} onClick={onClick}
      style={{ padding: "5px 11px", borderRadius: "7px", fontSize: "11.5px", fontWeight: 500, cursor: "pointer", transition: "all 0.1s",
        background: active ? "#0B0D14" : "white", color: active ? "white" : "#6E7681", border: `1px solid ${active ? "#0B0D14" : "#E8EAED"}` }}
    >{label}</button>
  );

  return (
    <div className="view-enter" style={S.page}>
      {/* Header */}
      <div style={S.topbar}>
        <div>
          <h1 style={S.heading}>Precedent Search</h1>
          <p style={S.sub}>AI-powered retrieval across 4.2M+ Indian court judgments</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#9CA3AF" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10B981" }} />
          Index live · updated 2 min ago
        </div>
      </div>

      {/* Search bar */}
      <div style={{ padding: "20px 28px 14px", background: "#F4F5F7", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px 10px 16px", borderRadius: "10px", background: "white", border: "1.5px solid #E8EAED", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="7" cy="7" r="5" stroke="#9CA3AF" strokeWidth="1.5"/>
            <path d="M11 11L14 14" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doSearch()}
            placeholder="Ask a legal question or describe the precedent you need..."
            autoFocus
            style={{ flex: 1, border: "none", outline: "none", fontSize: "13.5px", color: "#0D1117", background: "transparent" }}
          />
          {query && (
            <button onClick={() => { setQuery(""); setSearched(false); setLoading(false); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#C4C9D0", padding: "2px" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          )}
          <div style={{ width: "1px", height: "18px", background: "#E8EAED" }} />
          <button
            onClick={() => doSearch()}
            disabled={!query.trim()}
            style={{ padding: "7px 16px", borderRadius: "7px", background: "#0B0D14", border: "none", color: "white", fontSize: "12px", fontWeight: 600, cursor: query.trim() ? "pointer" : "default", opacity: query.trim() ? 1 : 0.45, display: "flex", alignItems: "center", gap: "6px" }}
          >
            Search <span style={{ opacity: 0.45, fontFamily: "monospace" }}>↵</span>
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "10px", flexWrap: "wrap" }}>
          {COURTS.map(f => filterBtn(f, court === f, () => setCourt(f)))}
          <div style={{ width: "1px", height: "16px", background: "#E8EAED" }} />
          {YEARS.map(f => filterBtn(f, year === f, () => setYear(f)))}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 28px 28px" }}>

        {/* Empty / suggestions */}
        {!searched && !loading && (
          <div>
            <div style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "18px 0 10px" }}>Suggested Searches</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
              {QUERIES.map((q, i) => (
                <button key={i} onClick={() => doSearch(q.text)}
                  style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px", borderRadius: "10px", background: "white", border: "1px solid #E8EAED", textAlign: "left", cursor: "pointer", transition: "border-color 0.12s, box-shadow 0.12s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#C7D2FE"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 10px rgba(79,70,229,0.08)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#E8EAED"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><circle cx="4.5" cy="4.5" r="3.5" stroke="#4F46E5" strokeWidth="1.2"/><path d="M7.5 7.5L10 10" stroke="#4F46E5" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    </div>
                    <span style={{ fontSize: "12.5px", color: "#374151", lineHeight: "1.45", fontWeight: 500 }}>{q.text}</span>
                  </div>
                  <div style={{ display: "flex", gap: "5px", paddingLeft: "32px" }}>
                    {q.tags.map(t => (
                      <span key={t} style={{ fontSize: "10px", fontWeight: 600, padding: "2px 7px", borderRadius: "100px", background: "#EEF2FF", color: "#4F46E5" }}>{t}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div style={{ marginTop: "18px", padding: "18px 20px", borderRadius: "12px", background: "#0B0D14", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>Database Coverage</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
                {[["1.2M+", "Supreme Court"], ["2.8M+", "High Courts"], ["180K+", "Tribunals"], ["5,400+", "Acts & Rules"]].map(([n, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: "20px", fontWeight: 800, color: "white", letterSpacing: "-0.8px", lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "3px" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ marginTop: "20px", padding: "20px", borderRadius: "12px", background: "white", border: "1px solid #E8EAED" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div className="spin" style={{ width: "13px", height: "13px", borderRadius: "50%", border: "2px solid #4F46E5", borderTopColor: "transparent" }} />
              </div>
              <div>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#0D1117" }}>Searching 4.2M+ judgments</div>
                <div style={{ fontSize: "11px", color: "#8C929A", marginTop: "2px" }}>"{searchedQ}"</div>
              </div>
            </div>
            {["Analyzing query semantics and legal context", "Retrieving relevant precedents with vector search", "Synthesizing AI legal analysis"].map((label, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: step > i ? "#EEF2FF" : "#F4F5F7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {step > i + 1 ? (
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#4F46E5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : step === i + 1 ? (
                    <div className="blink" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4F46E5" }} />
                  ) : (
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#E8EAED" }} />
                  )}
                </div>
                <span style={{ fontSize: "12.5px", color: step >= i + 1 ? "#374151" : "#9CA3AF", fontWeight: step === i + 1 ? 500 : 400 }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {searched && (
          <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginTop: "14px" }}>
            {/* Main column */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* AI Analysis */}
              <div style={{ borderRadius: "12px", overflow: "hidden", background: "white", border: "1px solid #E8EAED" }}>
                <div style={{ padding: "10px 16px", background: "linear-gradient(90deg, #F5F3FF, #EEF2FF)", borderBottom: "1px solid #DDD6FE", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "rgba(79,70,229,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1L1 4.5V10.5H10V4.5L5.5 1Z" fill="#4F46E5" opacity="0.9"/></svg>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#4338CA", textTransform: "uppercase", letterSpacing: "0.08em" }}>AI Legal Analysis</span>
                  <span style={{ marginLeft: "auto", fontSize: "11px", color: "#7C3AED" }}>"{searchedQ.slice(0, 45)}{searchedQ.length > 45 ? "…" : ""}"</span>
                </div>
                <div style={{ padding: "16px" }}>
                  <div style={{ fontSize: "13px", color: "#374151", lineHeight: "1.75" }}>
                    {AI_ANALYSIS.map((p, i) => p.bold ? <strong key={i} style={{ color: "#0D1117" }}>{p.text}</strong> : <span key={i}>{p.text}</span>)}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #F1F3F5" }}>
                    <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Based on {RESULTS.length} precedents · {court} · {year}</span>
                    <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                      <button style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: "#4F46E5", background: "#EEF2FF", border: "none", cursor: "pointer" }}>Copy Analysis</button>
                      <button style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: "#6E7681", background: "#F4F5F7", border: "1px solid #E8EAED", cursor: "pointer" }}>Export PDF</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sort + count */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "#0D1117" }}>{RESULTS.length} precedents <span style={{ fontWeight: 400, color: "#9CA3AF" }}>· {court} · {year}</span></span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontSize: "11.5px", color: "#9CA3AF" }}>Sort:</span>
                  {SORTS.map(s => (
                    <button key={s} onClick={() => setSort(s)}
                      style={{ padding: "4px 9px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, cursor: "pointer", background: sort === s ? "#0B0D14" : "#F4F5F7", color: sort === s ? "white" : "#6E7681", border: "none" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result cards */}
              {sorted.map(r => {
                const sel = selectedId === r.id;
                return (
                  <div key={r.id} onClick={() => setSelectedId(sel ? null : r.id)}
                    style={{ borderRadius: "12px", background: "white", border: `1.5px solid ${sel ? "#4F46E5" : "#E8EAED"}`, boxShadow: sel ? "0 0 0 3px rgba(79,70,229,0.09)" : "none", cursor: "pointer", overflow: "hidden", transition: "border-color 0.1s, box-shadow 0.1s" }}
                  >
                    <div style={{ height: "2px", background: `linear-gradient(90deg, #4F46E5 ${r.relevance}%, #F1F3F5 ${r.relevance}%)` }} />
                    <div style={{ padding: "14px 16px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px", marginBottom: "10px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px", flexWrap: "wrap" }}>
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", color: "#9CA3AF" }}>{r.citation}</span>
                            <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#F0FDF4", color: "#059669" }}>{r.relevance}% match</span>
                            <span style={{ fontSize: "10.5px", color: "#C4C9D0" }}>·</span>
                            <span style={{ fontSize: "10.5px", color: "#8C929A" }}>{r.date}</span>
                          </div>
                          <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0D1117", margin: "0 0 5px", letterSpacing: "-0.2px", lineHeight: "1.3" }}>{r.case}</h3>
                          <div style={{ fontSize: "11.5px", color: "#8C929A", display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            <span>{r.court}</span><span style={{ color: "#E8EAED" }}>·</span>
                            <span>{r.bench}</span><span style={{ color: "#E8EAED" }}>·</span>
                            <span>{r.judges}</span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: "18px", fontWeight: 800, color: "#0D1117", letterSpacing: "-0.5px" }}>{r.cited.toLocaleString()}</div>
                          <div style={{ fontSize: "10.5px", color: "#9CA3AF", marginTop: "1px" }}>citations</div>
                        </div>
                      </div>
                      <p style={{ fontSize: "12px", color: "#6E7681", lineHeight: "1.65", margin: "0 0 11px" }}>{r.summary.slice(0, 230)}…</p>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap" }}>
                        {r.tags.map(t => <span key={t} style={{ fontSize: "10.5px", fontWeight: 500, padding: "2px 8px", borderRadius: "100px", background: "#EEF2FF", color: "#4F46E5" }}>{t}</span>)}
                        {r.acts.map(a => <span key={a} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", padding: "2px 7px", borderRadius: "4px", background: "#F4F5F7", color: "#6E7681" }}>{a}</span>)}
                        <button onClick={e => e.stopPropagation()} style={{ marginLeft: "auto", padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: "#4F46E5", background: "#EEF2FF", border: "none", cursor: "pointer" }}>Add to Brief</button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detail panel */}
            {selectedId !== null && (() => {
              const r = RESULTS.find(x => x.id === selectedId);
              if (!r) return null;
              return (
                <div style={{ width: "340px", flexShrink: 0, borderRadius: "12px", background: "white", border: "1px solid #E8EAED", overflow: "hidden", position: "sticky", top: "0" }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid #F1F3F5", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    <div>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#9CA3AF" }}>{r.citation}</span>
                      <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#0D1117", margin: "4px 0 0", lineHeight: "1.3", letterSpacing: "-0.2px" }}>{r.case}</h3>
                    </div>
                    <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#C4C9D0", padding: "2px", flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div style={{ padding: "11px 12px", borderRadius: "9px", background: "#FFFBEB", border: "1px solid #FDE68A", marginBottom: "14px" }}>
                      <div style={{ fontSize: "9.5px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Key Holding</div>
                      <p style={{ fontSize: "12px", color: "#78350F", lineHeight: "1.6", margin: 0 }}>{r.keyHolding}</p>
                    </div>
                    <p style={{ fontSize: "12px", color: "#6E7681", lineHeight: "1.7", margin: "0 0 14px" }}>{r.summary}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "9px", marginBottom: "14px", paddingBottom: "14px", borderBottom: "1px solid #F1F3F5" }}>
                      {[["Court", r.court], ["Bench", r.bench], ["Coram", r.judges], ["Cited by", `${r.cited.toLocaleString()} judgments`]].map(([l, v]) => (
                        <div key={l} style={{ display: "flex", gap: "10px" }}>
                          <span style={{ fontSize: "11.5px", color: "#9CA3AF", flexShrink: 0, width: "52px" }}>{l}</span>
                          <span style={{ fontSize: "11.5px", color: "#374151", lineHeight: "1.4" }}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
                      <button style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#0B0D14", border: "none", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Open Full Judgment</button>
                      <button style={{ width: "100%", padding: "9px", borderRadius: "8px", background: "#EEF2FF", border: "none", color: "#4F46E5", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Add to Case Brief</button>
                    </div>
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
