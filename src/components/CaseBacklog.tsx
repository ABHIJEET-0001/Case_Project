import { useState } from "react";

const ALL_CASES = [
  { id: "W.P.(CRL) 267/2024",  title: "Ananya Singh vs. State of NCT of Delhi",     type: "Writ (Criminal)",   judge: "P. Krishnamurthy", priority: "critical", score: 96, status: "urgent",    nextDate: "02 Sep", pendency: "28 days",   value: null,       acts: ["Art. 22", "CrPC §439"],   petitioner: "Ananya Singh",           respondent: "State of NCT of Delhi", court: "Delhi HC", age: "28 days" },
  { id: "WP(C) 4821/2024",     title: "Sharma vs. Union of India",                   type: "Writ (Civil)",      judge: "R. Sharma",        priority: "critical", score: 94, status: "hearing",   nextDate: "04 Sep", pendency: "2.3 yrs",   value: null,       acts: ["Art. 21", "CrPC §167"],   petitioner: "Rajesh Sharma",          respondent: "Union of India",        court: "Delhi HC", age: "847 days" },
  { id: "CRL.A. 1127/2023",    title: "State of UP vs. Mohammad Farooqui",           type: "Criminal Appeal",   judge: "K. Mehta",         priority: "high",     score: 87, status: "reserved",  nextDate: "11 Sep", pendency: "3.3 yrs",   value: null,       acts: ["IPC §376", "POCSO §4"],   petitioner: "State of Uttar Pradesh", respondent: "Mohammad Farooqui",     court: "Delhi HC", age: "1203 days" },
  { id: "CS(COMM) 302/2024",   title: "Tata Consultancy vs. Infosys Ltd.",           type: "Commercial Suit",   judge: "S. Kumar",         priority: "high",     score: 82, status: "arguments", nextDate: "06 Sep", pendency: "1.1 yrs",   value: "₹340 Cr",  acts: ["Copyright Act §51"],      petitioner: "Tata Consultancy Services", respondent: "Infosys Limited",    court: "Delhi HC", age: "412 days" },
  { id: "CS(COMM) 187/2023",   title: "Reliance Industries vs. Future Group",        type: "Commercial Suit",   judge: "S. Kumar",         priority: "high",     score: 79, status: "arguments", nextDate: "09 Sep", pendency: "2.4 yrs",   value: "₹1,200 Cr",acts: ["Arbitration Act"],         petitioner: "Reliance Industries Ltd.", respondent: "Future Group",       court: "Delhi HC", age: "892 days" },
  { id: "FAO(OS) 88/2023",     title: "Mehta Family Trust vs. NBCC India",           type: "First Appeal",      judge: "R. Sharma",        priority: "medium",   score: 63, status: "pending",   nextDate: "18 Sep", pendency: "5.8 yrs",   value: null,       acts: ["Transfer of Property Act"],petitioner: "Mehta Family Trust",     respondent: "NBCC India Ltd.",       court: "Delhi HC", age: "2104 days" },
  { id: "W.P.(C) 3912/2022",   title: "Delhi Teachers Association vs. GNCT",         type: "Writ (Civil)",      judge: "P. Krishnamurthy", priority: "medium",   score: 61, status: "pending",   nextDate: "22 Sep", pendency: "4.0 yrs",   value: null,       acts: ["Art. 19", "Art. 14"],     petitioner: "Delhi Teachers Association", respondent: "GNCT of Delhi",     court: "Delhi HC", age: "1456 days" },
  { id: "CRL.A. 892/2021",     title: "State vs. Suresh Kumar Koushal",              type: "Criminal Appeal",   judge: "K. Mehta",         priority: "medium",   score: 58, status: "pending",   nextDate: "25 Sep", pendency: "5.0 yrs",   value: null,       acts: ["IPC §302"],               petitioner: "State of Delhi",         respondent: "Suresh Kumar Koushal",  court: "Delhi HC", age: "1823 days" },
  { id: "CS(OS) 1234/2020",    title: "Apollo Hospitals vs. Max Healthcare",         type: "Civil Suit",        judge: "S. Kumar",         priority: "low",      score: 41, status: "pending",   nextDate: "01 Oct", pendency: "6.0 yrs",   value: "₹45 Cr",   acts: ["Contract Act"],           petitioner: "Apollo Hospitals Ltd.",  respondent: "Max Healthcare",        court: "Delhi HC", age: "2190 days" },
  { id: "FAO 558/2022",        title: "Vikram Nair vs. Delhi Development Authority", type: "First Appeal",      judge: "R. Sharma",        priority: "low",      score: 38, status: "pending",   nextDate: "08 Oct", pendency: "4.5 yrs",   value: null,       acts: ["Land Acquisition Act"],   petitioner: "Vikram Nair",            respondent: "Delhi Development Auth.", court: "Delhi HC", age: "1642 days" },
  { id: "W.P.(C) 7832/2019",   title: "Lawyers Collective vs. Bar Council of Delhi", type: "Writ (Civil)",     judge: "K. Mehta",         priority: "low",      score: 34, status: "pending",   nextDate: "15 Oct", pendency: "7.5 yrs",   value: null,       acts: ["Advocates Act"],          petitioner: "Lawyers Collective",     respondent: "Bar Council of Delhi",  court: "Delhi HC", age: "2738 days" },
  { id: "CS(COMM) 443/2021",   title: "Samsung India vs. Micromax Informatics",      type: "Commercial Suit",   judge: "S. Kumar",         priority: "low",      score: 31, status: "pending",   nextDate: "20 Oct", pendency: "5.4 yrs",   value: "₹78 Cr",   acts: ["Patent Act"],             petitioner: "Samsung India Pvt. Ltd.", respondent: "Micromax Informatics",  court: "Delhi HC", age: "1980 days" },
];

const PRIORITY = {
  critical: { label: "Critical", color: "#DC2626", bg: "rgba(220,38,38,0.07)", border: "rgba(220,38,38,0.15)" },
  high:     { label: "High",     color: "#D97706", bg: "rgba(217,119,6,0.07)",  border: "rgba(217,119,6,0.15)"  },
  medium:   { label: "Medium",   color: "#2563EB", bg: "rgba(37,99,235,0.07)",  border: "rgba(37,99,235,0.15)"  },
  low:      { label: "Low",      color: "#6B7280", bg: "rgba(107,114,128,0.05)",border: "rgba(107,114,128,0.1)" },
};

const STATUS = {
  urgent:    { label: "Urgent",      dot: "#DC2626" },
  hearing:   { label: "In Hearing",  dot: "#2563EB" },
  reserved:  { label: "Reserved",    dot: "#D97706" },
  arguments: { label: "Arguments",   dot: "#059669" },
  pending:   { label: "Pending",     dot: "#9CA3AF" },
};

type PriorityKey = "critical" | "high" | "medium" | "low";

export default function CaseBacklog({ onNavigate }: { onNavigate: (view: string, data?: unknown) => void }) {
  const [filter, setFilter] = useState<"all" | PriorityKey>("all");
  const [sort, setSort]     = useState("score");
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const filtered = ALL_CASES
    .filter(c => filter === "all" || c.priority === filter)
    .filter(c => !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sort === "score" ? b.score - a.score : sort === "age" ? parseInt(b.age) - parseInt(a.age) : 0);

  const counts = { all: ALL_CASES.length, critical: 2, high: 3, medium: 3, low: 4 };

  const toggle = (id: string) =>
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);

  const pillBtn = (label: string, count: number, key: "all" | PriorityKey) => {
    const active = filter === key;
    const p = key !== "all" ? PRIORITY[key] : null;
    return (
      <button key={key} onClick={() => setFilter(key)}
        style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "7px", fontSize: "11.5px", fontWeight: 500, cursor: "pointer", border: "none", transition: "all 0.1s",
          background: active ? (p ? p.bg : "#0B0D14") : "white",
          color: active ? (p ? p.color : "white") : "#6E7681",
          outline: active && p ? `1px solid ${p.border}` : active ? "1px solid #0B0D14" : "1px solid #E8EAED",
        }}
      >
        {label}
        <span style={{ fontSize: "10px", fontWeight: 700, padding: "0 4px", borderRadius: "100px", background: active ? "rgba(255,255,255,0.25)" : "#F4F5F7", color: active ? (p ? p.color : "white") : "#9CA3AF" }}>{count}</span>
      </button>
    );
  };

  return (
    <div className="view-enter" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F4F5F7" }}>
      {/* Header */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EAED", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#0D1117", letterSpacing: "-0.3px", margin: 0 }}>Case Backlog</h1>
          <p style={{ fontSize: "12px", color: "#8C929A", margin: "3px 0 0" }}>AI-prioritized · {ALL_CASES.length} cases · Delhi HC, Division Bench II</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 12px", borderRadius: "8px", background: "white", border: "1px solid #E8EAED", fontSize: "12px", color: "#6E7681", cursor: "pointer", fontWeight: 500 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 3.5H11.5M3.5 6.5H9.5M5.5 9.5H7.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
            Export
          </button>
          <button style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", background: "#0B0D14", border: "none", fontSize: "12px", color: "white", cursor: "pointer", fontWeight: 600 }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1V10M1 5.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
            Add Case
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EAED", padding: "10px 28px", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 12px", borderRadius: "7px", background: "#F4F5F7", border: "1px solid #E8EAED", flex: "0 0 260px" }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="#9CA3AF" strokeWidth="1.4"/><path d="M9 9L12 12" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cases..." style={{ border: "none", outline: "none", background: "transparent", fontSize: "12px", color: "#374151", flex: 1 }} />
        </div>

        {/* Priority filters */}
        <div style={{ display: "flex", gap: "5px" }}>
          {pillBtn("All", counts.all, "all")}
          {pillBtn("Critical", counts.critical, "critical")}
          {pillBtn("High", counts.high, "high")}
          {pillBtn("Medium", counts.medium, "medium")}
          {pillBtn("Low", counts.low, "low")}
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11.5px", color: "#9CA3AF" }}>Sort:</span>
          {[["score", "AI Score"], ["age", "Case Age"]].map(([val, label]) => (
            <button key={val} onClick={() => setSort(val)}
              style={{ padding: "5px 9px", borderRadius: "6px", fontSize: "11px", fontWeight: 500, cursor: "pointer", border: "none", background: sort === val ? "#0B0D14" : "#F4F5F7", color: sort === val ? "white" : "#6E7681" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div style={{ background: "#EFF6FF", borderBottom: "1px solid #DBEAFE", padding: "9px 28px", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <span style={{ fontSize: "12.5px", fontWeight: 600, color: "#1D4ED8" }}>{selected.length} selected</span>
          <div style={{ display: "flex", gap: "6px" }}>
            {["Reassign Judge", "Mark Urgent", "Schedule Hearing", "Export"].map(a => (
              <button key={a} style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: "#2563EB", background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.15)", cursor: "pointer" }}>{a}</button>
            ))}
          </div>
          <button onClick={() => setSelected([])} style={{ marginLeft: "auto", fontSize: "11.5px", color: "#3B82F6", background: "none", border: "none", cursor: "pointer" }}>Clear</button>
        </div>
      )}

      {/* Table */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FAFBFC", borderBottom: "1px solid #E8EAED", position: "sticky", top: 0, zIndex: 1 }}>
              <th style={{ width: "44px", padding: "9px 16px 9px 20px" }}>
                <input type="checkbox"
                  checked={selected.length === filtered.length && filtered.length > 0}
                  onChange={e => setSelected(e.target.checked ? filtered.map(c => c.id) : [])}
                  style={{ cursor: "pointer" }}
                />
              </th>
              {["Score", "Case", "Type", "Judge", "Status", "Pendency", "Next Date", "Value", ""].map(h => (
                <th key={h} style={{ padding: "9px 12px 9px 0", fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.07em", textAlign: "left", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => {
              const p = PRIORITY[c.priority as PriorityKey];
              const s = STATUS[c.status as keyof typeof STATUS];
              const sel = selected.includes(c.id);
              return (
                <tr key={c.id}
                  style={{ borderBottom: "1px solid #F4F5F7", background: sel ? "#EFF6FF" : "white", transition: "background 0.08s", cursor: "pointer" }}
                  onMouseEnter={e => { if (!sel) (e.currentTarget as HTMLTableRowElement).style.background = "#FAFAFF"; }}
                  onMouseLeave={e => { if (!sel) (e.currentTarget as HTMLTableRowElement).style.background = "white"; }}
                >
                  <td style={{ padding: "10px 16px 10px 20px" }} onClick={e => { e.stopPropagation(); toggle(c.id); }}>
                    <input type="checkbox" checked={sel} onChange={() => toggle(c.id)} style={{ cursor: "pointer" }} />
                  </td>
                  {/* Score */}
                  <td style={{ padding: "10px 12px 10px 0" }} onClick={() => onNavigate("detail", c)}>
                    <div style={{ width: "34px", height: "34px", borderRadius: "8px", background: p.bg, border: `1px solid ${p.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "13px", fontWeight: 800, color: p.color, letterSpacing: "-0.5px" }}>{c.score}</span>
                    </div>
                  </td>
                  {/* Case */}
                  <td style={{ padding: "10px 16px 10px 0", maxWidth: "280px" }} onClick={() => onNavigate("detail", c)}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>{c.id}</div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#0D1117", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", letterSpacing: "-0.1px", marginBottom: "3px" }}>{c.title}</div>
                    <div style={{ display: "flex", gap: "4px" }}>
                      {c.acts.slice(0, 2).map(a => <span key={a} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "9.5px", padding: "1px 5px", borderRadius: "3px", background: "#F4F5F7", color: "#8C929A" }}>{a}</span>)}
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }} onClick={() => onNavigate("detail", c)}>
                    <span style={{ fontSize: "11.5px", color: "#6E7681", whiteSpace: "nowrap" }}>{c.type}</span>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }} onClick={() => onNavigate("detail", c)}>
                    <span style={{ fontSize: "11.5px", color: "#6E7681", whiteSpace: "nowrap" }}>Justice {c.judge}</span>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }} onClick={() => onNavigate("detail", c)}>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                      <span style={{ fontSize: "11.5px", color: "#6E7681", whiteSpace: "nowrap" }}>{s.label}</span>
                    </div>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }} onClick={() => onNavigate("detail", c)}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11.5px", color: "#6E7681" }}>{c.pendency}</span>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }} onClick={() => onNavigate("detail", c)}>
                    <span style={{ fontSize: "11.5px", color: "#6E7681" }}>{c.nextDate}</span>
                  </td>
                  <td style={{ padding: "10px 12px 10px 0" }} onClick={() => onNavigate("detail", c)}>
                    {c.value
                      ? <span style={{ fontSize: "11.5px", fontWeight: 600, color: "#D97706" }}>{c.value}</span>
                      : <span style={{ color: "#D1D5DB" }}>—</span>}
                  </td>
                  <td style={{ padding: "10px 16px 10px 0" }}>
                    <button onClick={() => onNavigate("detail", c)}
                      style={{ padding: "5px 10px", borderRadius: "6px", fontSize: "11px", fontWeight: 600, color: "#6E7681", background: "#F4F5F7", border: "1px solid #E8EAED", cursor: "pointer", whiteSpace: "nowrap" }}>
                      Open →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
