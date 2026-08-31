import { useState } from "react";

interface CaseDetailProps {
  caseData: Record<string, unknown>;
  onBack: () => void;
  onNavigate: (view: string, data?: unknown) => void;
}

const PRECEDENTS = [
  { citation: "(2022) 10 SCC 51", title: "Satender Kumar Antil vs. CBI", relevance: 97, court: "Supreme Court" },
  { citation: "(2021) 2 SCC 427", title: "Arnab Goswami vs. State of Maharashtra", relevance: 89, court: "Supreme Court" },
  { citation: "(2019) 5 SCC 1", title: "Arnesh Kumar vs. State of Bihar", relevance: 84, court: "Supreme Court" },
];

const DOCS = [
  { name: "Writ Petition — Ananya Singh vs State of Delhi.pdf", size: "2.4 MB", date: "01 Aug 2026" },
  { name: "Bail Application u/s CrPC §439.pdf", size: "1.1 MB", date: "15 Aug 2026" },
  { name: "Detention Order — Delhi Police.pdf", size: "0.8 MB", date: "01 Aug 2026" },
  { name: "Medical Certificate — AIIMS Delhi.pdf", size: "0.5 MB", date: "12 Aug 2026" },
  { name: "Previous Bail Order — Sessions Court.pdf", size: "1.8 MB", date: "28 Jul 2026" },
  { name: "Vakalatnama — Kapil Sibal & Assoc.pdf", size: "0.2 MB", date: "01 Aug 2026" },
  { name: "Index of Documents.pdf", size: "0.1 MB", date: "01 Aug 2026" },
];

const TIMELINE = [
  { date: "28 Aug 2026", event: "AI priority score updated to 96 (Critical)", sub: "Automated — 28-day detention threshold reached", type: "ai" },
  { date: "15 Aug 2026", event: "Bail application filed under CrPC §439", sub: "Filed by Adv. Kapil Sibal & Assoc.", type: "filing" },
  { date: "10 Aug 2026", event: "Case assigned to Justice P. Krishnamurthy", sub: "Randomized bench allocation by Chief Justice", type: "admin" },
  { date: "04 Aug 2026", event: "Case admitted. Notice issued to State", sub: "Next date: 02 Sep 2026 · Court 7", type: "order" },
  { date: "02 Aug 2026", event: "Case registered — Registry", sub: "Case no. W.P.(CRL) 267/2024 allotted", type: "admin" },
  { date: "01 Aug 2026", event: "Writ Petition filed u/s Art. 226", sub: "Habeas Corpus — personal liberty", type: "filing" },
];

const TYPE_DOTS: Record<string, string> = { ai: "#4F46E5", filing: "#059669", order: "#D97706", admin: "#9CA3AF" };

const TABS = ["Overview", "Precedents", "Documents", "Timeline", "Notes"];

export default function CaseDetail({ caseData, onBack, onNavigate }: CaseDetailProps) {
  const [tab, setTab] = useState("Overview");

  const c = caseData as {
    id?: string; title?: string; type?: string; judge?: string;
    priority?: string; score?: number; status?: string; nextDate?: string;
    acts?: string[]; petitioner?: string; respondent?: string;
    aiFlag?: string; court?: string; age?: string;
  };

  const priorityColors: Record<string, string> = {
    critical: "#DC2626", high: "#D97706", medium: "#2563EB", low: "#6B7280"
  };
  const pColor = priorityColors[c.priority ?? "low"] ?? "#6B7280";

  return (
    <div className="view-enter" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F4F5F7" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EAED", padding: "12px 28px", flexShrink: 0 }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "12px" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", fontSize: "12px", padding: 0 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 3L5 6.5L8 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Case Backlog
          </button>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M5 3L8 6.5L5 10" stroke="#D1D5DB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: "12px", color: "#9CA3AF", fontFamily: "'JetBrains Mono', monospace" }}>{c.id ?? "W.P.(CRL) 267/2024"}</span>
        </div>

        {/* Title row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#9CA3AF" }}>{c.id ?? "W.P.(CRL) 267/2024"}</span>
              <span style={{ fontSize: "9.5px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: `${pColor}12`, color: pColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {(c.priority ?? "critical").toUpperCase()}
              </span>
              <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "4px", background: "#FFF1F2", color: "#DC2626" }}>
                Score: {c.score ?? 96}
              </span>
            </div>
            <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#0D1117", letterSpacing: "-0.4px", margin: "0 0 8px" }}>
              {c.title ?? "Ananya Singh vs. State of NCT of Delhi"}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#8C929A", flexWrap: "wrap" }}>
              <span>{c.type ?? "Writ (Criminal)"}</span>
              <span style={{ color: "#E8EAED" }}>·</span>
              <span>Justice {c.judge ?? "P. Krishnamurthy"}</span>
              <span style={{ color: "#E8EAED" }}>·</span>
              <span>{c.court ?? "Delhi HC"} · Court 7</span>
              <span style={{ color: "#E8EAED" }}>·</span>
              <span>Next: <strong style={{ color: "#374151" }}>{c.nextDate ?? "02 Sep 2026"}</strong></span>
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
            <button style={{ padding: "7px 12px", borderRadius: "8px", background: "white", border: "1px solid #E8EAED", fontSize: "12px", color: "#6E7681", cursor: "pointer", fontWeight: 500 }}>Share</button>
            <button style={{ padding: "7px 12px", borderRadius: "8px", background: "white", border: "1px solid #E8EAED", fontSize: "12px", color: "#6E7681", cursor: "pointer", fontWeight: 500 }}>Export PDF</button>
            <button style={{ padding: "7px 14px", borderRadius: "8px", background: "#0B0D14", border: "none", fontSize: "12px", color: "white", cursor: "pointer", fontWeight: 600 }}>Schedule Hearing</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EAED", padding: "0 28px", display: "flex", gap: "0", flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: "11px 14px", fontSize: "13px", fontWeight: tab === t ? 600 : 400, color: tab === t ? "#0D1117" : "#8C929A", background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "#0D1117" : "transparent"}`, marginBottom: "-1px", cursor: "pointer", transition: "all 0.1s" }}>
            {t}
            {t === "Precedents" && <span style={{ marginLeft: "5px", fontSize: "10px", padding: "1px 5px", borderRadius: "100px", background: "#F4F5F7", color: "#9CA3AF" }}>3</span>}
            {t === "Documents" && <span style={{ marginLeft: "5px", fontSize: "10px", padding: "1px 5px", borderRadius: "100px", background: "#F4F5F7", color: "#9CA3AF" }}>7</span>}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px" }}>

        {tab === "Overview" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* AI Analysis */}
              <div style={{ borderRadius: "12px", overflow: "hidden", background: "#0B0D14", border: "1px solid rgba(99,102,241,0.2)" }}>
                <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "rgba(99,102,241,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1L1 4.5V10.5H10V4.5L5.5 1Z" fill="#818CF8"/></svg>
                  </div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#818CF8", textTransform: "uppercase", letterSpacing: "0.1em" }}>AI Case Analysis</span>
                </div>
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: "1.75", margin: "0 0 12px" }}>
                    This is a <strong style={{ color: "white" }}>habeas corpus writ</strong> with a critical liberty violation. The petitioner has been detained for{" "}
                    <strong style={{ color: "#FCA5A5" }}>28 days</strong>, approaching the 60-day statutory maximum under CrPC §167(2). An immediate bail hearing is constitutionally mandated under Art. 22(2).
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {["Habeas Corpus", "Art. 21 — Personal Liberty", "60-day Breach Risk", "Expedited Listing Required"].map((tag, i) => (
                      <span key={tag} style={{ fontSize: "11px", padding: "3px 9px", borderRadius: "100px", fontWeight: 500,
                        background: i < 2 ? "rgba(99,102,241,0.2)" : i === 2 ? "rgba(220,38,38,0.2)" : "rgba(255,255,255,0.06)",
                        color: i < 2 ? "#A5B4FC" : i === 2 ? "#FCA5A5" : "rgba(255,255,255,0.45)" }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Parties */}
              <div style={{ borderRadius: "12px", background: "white", border: "1px solid #E8EAED", padding: "16px" }}>
                <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0D1117", margin: "0 0 12px", letterSpacing: "-0.2px" }}>Parties</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div style={{ padding: "12px", borderRadius: "9px", background: "#F5F7FF", border: "1px solid #E0E7FF" }}>
                    <div style={{ fontSize: "9.5px", fontWeight: 700, color: "#4338CA", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Petitioner</div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0D1117", marginBottom: "3px" }}>{c.petitioner ?? "Ananya Singh"}</div>
                    <div style={{ fontSize: "11.5px", color: "#8C929A" }}>Through: Adv. Kapil Sibal & Assoc.</div>
                  </div>
                  <div style={{ padding: "12px", borderRadius: "9px", background: "#FFFBF0", border: "1px solid #FDE68A" }}>
                    <div style={{ fontSize: "9.5px", fontWeight: 700, color: "#92400E", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "5px" }}>Respondent</div>
                    <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0D1117", marginBottom: "3px" }}>{c.respondent ?? "State of NCT of Delhi"}</div>
                    <div style={{ fontSize: "11.5px", color: "#8C929A" }}>Through: ASG, Delhi</div>
                  </div>
                </div>
              </div>

              {/* Case details */}
              <div style={{ borderRadius: "12px", background: "white", border: "1px solid #E8EAED", padding: "16px" }}>
                <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0D1117", margin: "0 0 12px", letterSpacing: "-0.2px" }}>Case Details</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                  {[
                    ["Case Number", c.id ?? "W.P.(CRL) 267/2024"],
                    ["Filing Date", "01 August 2026"],
                    ["Case Type", c.type ?? "Writ (Criminal)"],
                    ["Bench", "Single Judge · Court 7"],
                    ["Presiding Judge", `Justice ${c.judge ?? "P. Krishnamurthy"}`],
                    ["Next Hearing", c.nextDate ?? "02 Sep 2026"],
                    ["Pendency", c.age ?? "28 days"],
                    ["Registration", "02 Aug 2026"],
                  ].map(([l, v], i) => (
                    <div key={l} style={{ padding: "10px 0", borderBottom: "1px solid #F4F5F7", paddingRight: i % 2 === 0 ? "20px" : "0" }}>
                      <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "3px" }}>{l}</div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>{v as string}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right sidebar */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Priority score */}
              <div style={{ borderRadius: "12px", background: "white", border: "1px solid #E8EAED", padding: "16px" }}>
                <div style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>AI Priority Score</div>
                <div style={{ fontSize: "52px", fontWeight: 900, color: pColor, letterSpacing: "-3px", lineHeight: 1, marginBottom: "5px" }}>{c.score ?? 96}</div>
                <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "12px" }}>Out of 100 · recomputed 2 hours ago</div>
                <div style={{ height: "6px", borderRadius: "100px", background: "#F4F5F7", marginBottom: "12px" }}>
                  <div style={{ height: "6px", borderRadius: "100px", width: `${c.score ?? 96}%`, background: `linear-gradient(90deg, ${pColor}80, ${pColor})` }} />
                </div>
                {[
                  { f: "Liberty at risk", w: 35, s: 35 },
                  { f: "Statutory deadline", w: 20, s: 20 },
                  { f: "Constitutional impact", w: 20, s: 18 },
                  { f: "Case age", w: 25, s: 7 },
                ].map(m => (
                  <div key={m.f} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11.5px", color: "#6E7681" }}>{m.f}</span>
                    <span style={{ fontSize: "11.5px", fontFamily: "'JetBrains Mono', monospace", color: "#374151", fontWeight: 500 }}>{m.s}/{m.w}</span>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div style={{ borderRadius: "12px", background: "white", border: "1px solid #E8EAED", padding: "16px" }}>
                <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0D1117", marginBottom: "10px", letterSpacing: "-0.2px" }}>Quick Actions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {[
                    { label: "Schedule Emergency Hearing", color: "#DC2626", bg: "#FFF5F5" },
                    { label: "Search Bail Precedents",     color: "#4F46E5", bg: "#EEF2FF", nav: "search" },
                    { label: "Generate AI Case Summary",  color: "#059669", bg: "#F0FDF4" },
                    { label: "Notify Advocates",          color: "#D97706", bg: "#FFFBEB" },
                  ].map(a => (
                    <button key={a.label}
                      onClick={() => a.nav && onNavigate(a.nav)}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 11px", borderRadius: "8px", background: a.bg, border: "none", cursor: "pointer", textAlign: "left" }}>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: a.color }}>{a.label}</span>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 6H9M7 4L9 6L7 8" stroke={a.color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "Precedents" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ padding: "12px 14px", borderRadius: "10px", background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
              <span style={{ fontSize: "12.5px", color: "#3730A3", fontWeight: 500 }}>3 highly relevant Supreme Court precedents found for bail in habeas corpus matters — ranked by constitutional similarity.</span>
            </div>
            {PRECEDENTS.map((p, i) => (
              <div key={i} style={{ padding: "16px", borderRadius: "12px", background: "white", border: "1px solid #E8EAED" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "5px" }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", color: "#9CA3AF" }}>{p.citation}</span>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "#F0FDF4", color: "#059669" }}>{p.relevance}% relevant</span>
                    </div>
                    <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0D1117", margin: "0 0 3px", letterSpacing: "-0.2px" }}>{p.title}</h3>
                    <div style={{ fontSize: "11.5px", color: "#8C929A" }}>{p.court}</div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <button style={{ padding: "6px 10px", borderRadius: "7px", fontSize: "11.5px", fontWeight: 600, color: "#4F46E5", background: "#EEF2FF", border: "none", cursor: "pointer" }}>Add to Brief</button>
                    <button onClick={() => onNavigate("search")} style={{ padding: "6px 10px", borderRadius: "7px", fontSize: "11.5px", fontWeight: 600, color: "#6E7681", background: "#F4F5F7", border: "1px solid #E8EAED", cursor: "pointer" }}>Full Judgment</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Documents" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {DOCS.map((doc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", borderRadius: "10px", background: "white", border: "1px solid #E8EAED", cursor: "pointer", transition: "border-color 0.1s" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#C7D2FE"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "#E8EAED"}
              >
                <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: "#FFF5F5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="1" width="10" height="12" rx="1.5" stroke="#DC2626" strokeWidth="1.3"/><path d="M4 5H10M4 7.5H10M4 10H7.5" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round"/></svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#0D1117", marginBottom: "2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</div>
                  <div style={{ fontSize: "11.5px", color: "#9CA3AF" }}>{doc.size} · {doc.date}</div>
                </div>
                <button style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "11.5px", fontWeight: 600, color: "#6E7681", background: "#F4F5F7", border: "none", cursor: "pointer" }}>View</button>
              </div>
            ))}
          </div>
        )}

        {tab === "Timeline" && (
          <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", gap: "0" }}>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", paddingBottom: i < TIMELINE.length - 1 ? "20px" : "0" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "16px", flexShrink: 0 }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: TYPE_DOTS[item.type], marginTop: "4px", flexShrink: 0 }} />
                  {i < TIMELINE.length - 1 && <div style={{ width: "1px", flex: 1, background: "#E8EAED", marginTop: "4px" }} />}
                </div>
                <div style={{ flex: 1, paddingBottom: i < TIMELINE.length - 1 ? "0" : "0" }}>
                  <div style={{ fontSize: "11px", color: "#9CA3AF", marginBottom: "3px" }}>{item.date}</div>
                  <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#0D1117", marginBottom: "2px", letterSpacing: "-0.1px" }}>{item.event}</div>
                  <div style={{ fontSize: "12px", color: "#8C929A" }}>{item.sub}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "Notes" && (
          <div style={{ maxWidth: "600px" }}>
            <div style={{ borderRadius: "12px", background: "white", border: "1px solid #E8EAED", overflow: "hidden" }}>
              <textarea
                placeholder="Add a note about this case... (visible to bench only)"
                style={{ width: "100%", padding: "16px", border: "none", outline: "none", fontSize: "13.5px", color: "#374151", resize: "none", lineHeight: "1.7", fontFamily: "inherit", minHeight: "120px", display: "block" }}
              />
              <div style={{ padding: "10px 16px", borderTop: "1px solid #F1F3F5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "11.5px", color: "#9CA3AF" }}>Visible to bench members only</span>
                <button style={{ padding: "6px 14px", borderRadius: "7px", background: "#0B0D14", border: "none", color: "white", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>Save Note</button>
              </div>
            </div>
            <div style={{ marginTop: "20px", textAlign: "center", color: "#9CA3AF", fontSize: "12px" }}>No notes yet. Add your first note above.</div>
          </div>
        )}
      </div>
    </div>
  );
}
