import { useState } from "react";

interface DashboardProps {
  onNavigate: (view: string, data?: unknown) => void;
}

/* ─── Sparkline helper ─── */
function Sparkline({ data, color, fill }: { data: number[]; color: string; fill: string }) {
  const w = 72, h = 28;
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const fillD = `M 0,${h} L ${pts.join(" L ")} L ${w},${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
      <path d={fillD} fill={fill} />
      <path d={pathD} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1].split(",")[0]} cy={pts[pts.length - 1].split(",")[1]} r="2.5" fill={color} />
    </svg>
  );
}

/* ─── Data ─── */
const cases = [
  {
    id: "W.P.(CRL) 267/2024",
    title: "Ananya Singh vs. State of NCT of Delhi",
    type: "Writ (Criminal)",
    judge: "Justice P. Krishnamurthy",
    priority: "critical" as const,
    score: 96,
    status: "urgent" as const,
    nextDate: "02 Sep 2026",
    acts: ["Art. 22", "CrPC §439"],
    petitioner: "Ananya Singh",
    respondent: "State of NCT of Delhi",
    aiFlag: "Bail matter — expedited hearing required",
    age: "28 days",
    court: "Delhi HC",
  },
  {
    id: "WP(C) 4821/2024",
    title: "Sharma vs. Union of India",
    type: "Writ Petition (Civil)",
    judge: "Justice R. Sharma",
    priority: "critical" as const,
    score: 94,
    status: "hearing" as const,
    nextDate: "04 Sep 2026",
    acts: ["Art. 21", "CrPC §167"],
    petitioner: "Rajesh Sharma",
    respondent: "Union of India",
    aiFlag: "Liberty at risk — habeas corpus pending",
    age: "847 days",
    court: "Delhi HC",
  },
  {
    id: "CRL.A. 1127/2023",
    title: "State of UP vs. Mohammad Farooqui",
    type: "Criminal Appeal",
    judge: "Justice K. Mehta",
    priority: "high" as const,
    score: 87,
    status: "reserved" as const,
    nextDate: "11 Sep 2026",
    acts: ["IPC §376", "POCSO §4"],
    petitioner: "State of Uttar Pradesh",
    respondent: "Mohammad Farooqui",
    aiFlag: "Judgment reserved — POCSO implications",
    age: "1,203 days",
    court: "Delhi HC",
  },
  {
    id: "CS(COMM) 302/2024",
    title: "Tata Consultancy Services vs. Infosys Ltd.",
    type: "Commercial Suit",
    judge: "Justice S. Kumar",
    priority: "high" as const,
    score: 82,
    status: "arguments" as const,
    nextDate: "06 Sep 2026",
    acts: ["Copyright Act §51"],
    petitioner: "Tata Consultancy Services",
    respondent: "Infosys Limited",
    aiFlag: "IP dispute — ₹340 Cr claim",
    age: "412 days",
    court: "Delhi HC",
  },
  {
    id: "FAO(OS) 88/2023",
    title: "Mehta Family Trust vs. NBCC India Ltd.",
    type: "First Appeal",
    judge: "Justice R. Sharma",
    priority: "medium" as const,
    score: 63,
    status: "pending" as const,
    nextDate: "18 Sep 2026",
    acts: ["Transfer of Property Act"],
    petitioner: "Mehta Family Trust",
    respondent: "NBCC India Ltd.",
    aiFlag: "Property dispute — 5+ year pendency",
    age: "2,104 days",
    court: "Delhi HC",
  },
];

const PRIORITY = {
  critical: { label: "Critical", color: "#DC2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.18)" },
  high:     { label: "High",     color: "#D97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.18)"  },
  medium:   { label: "Medium",   color: "#2563EB", bg: "rgba(37,99,235,0.08)",  border: "rgba(37,99,235,0.18)"  },
  low:      { label: "Low",      color: "#6B7280", bg: "rgba(107,114,128,0.06)",border: "rgba(107,114,128,0.12)"},
};

const STATUS = {
  urgent:    { label: "Urgent",      dot: "#DC2626" },
  hearing:   { label: "In Hearing",  dot: "#2563EB" },
  reserved:  { label: "Reserved",    dot: "#D97706" },
  arguments: { label: "Arguments",   dot: "#059669" },
  pending:   { label: "Pending",     dot: "#9CA3AF" },
};

const INSIGHTS = [
  {
    type: "alert" as const,
    heading: "Bail deadline breach approaching",
    body: "3 cases with bail petitions are nearing the 60-day statutory limit under CrPC §167.",
    action: "Review cases",
  },
  {
    type: "suggest" as const,
    heading: "Case cluster detected",
    body: "12 property dispute writs share near-identical facts — single bench order could dispose all.",
    action: "View cluster",
  },
  {
    type: "info" as const,
    heading: "SC directive",
    body: "All POCSO matters must be listed within 6 months per SLP (Crl.) 8234/2022.",
    action: "See affected",
  },
];

const insightColors = {
  alert:   { border: "#FCA5A5", bg: "#FFF5F5", dot: "#DC2626", action: "#DC2626" },
  suggest: { border: "#6EE7B7", bg: "#F0FDF9", dot: "#059669", action: "#059669" },
  info:    { border: "#C7D2FE", bg: "#F5F7FF", dot: "#4F46E5", action: "#4F46E5" },
};

const causeList = [
  { time: "10:30 AM", id: "W.P.(CRL) 267/2024", type: "Bail Hearing",  status: "urgent" as const },
  { time: "11:00 AM", id: "CS(COMM) 302/2024",  type: "Arguments",     status: "arguments" as const },
  { time: "02:00 PM", id: "WP(C) 4821/2024",    type: "Main Hearing",  status: "hearing" as const },
  { time: "03:30 PM", id: "FAO 558/2022",        type: "Pronouncement", status: "reserved" as const },
];

/* ─── Component ─── */
export default function Dashboard({ onNavigate }: DashboardProps) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <div className="view-enter" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#F4F5F7", overflowY: "auto" }}>

      {/* ── Top bar ── */}
      <div style={{ background: "white", borderBottom: "1px solid #E8EAED", padding: "14px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div>
          <h1 style={{ fontSize: "16px", fontWeight: 700, color: "#0D1117", letterSpacing: "-0.3px", margin: 0, lineHeight: 1.2 }}>
            Good morning, Justice Sharma
          </h1>
          <p style={{ fontSize: "12px", color: "#8C929A", margin: "3px 0 0", letterSpacing: "0.01em" }}>
            Friday, 29 August 2026 &nbsp;·&nbsp; Delhi High Court &nbsp;·&nbsp; Division Bench II &nbsp;·&nbsp; Court 7
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            onClick={() => onNavigate("search")}
            style={{ display: "flex", alignItems: "center", gap: "7px", padding: "7px 12px", borderRadius: "8px", background: "#F4F5F7", border: "1px solid #E8EAED", fontSize: "12.5px", color: "#6E7681", cursor: "pointer", fontWeight: 500 }}
          >
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="#9CA3AF" strokeWidth="1.4"/><path d="M9 9L12 12" stroke="#9CA3AF" strokeWidth="1.4" strokeLinecap="round"/></svg>
            Search precedents
            <kbd style={{ fontSize: "10px", background: "white", border: "1px solid #E8EAED", borderRadius: "4px", padding: "1px 5px", color: "#9CA3AF", fontFamily: "inherit" }}>⌘K</kbd>
          </button>
          <button
            style={{ display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px", borderRadius: "8px", background: "#0B0D14", border: "1px solid #0B0D14", fontSize: "12.5px", color: "white", fontWeight: 600, cursor: "pointer" }}
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1V10M1 5.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
            New Case
          </button>
          <button
            style={{ position: "relative", width: "34px", height: "34px", borderRadius: "8px", background: "#F4F5F7", border: "1px solid #E8EAED", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1C5.3 1 3.5 2.8 3.5 5V9.5L2 11V11.5H13V11L11.5 9.5V5C11.5 2.8 9.7 1 7.5 1Z" stroke="#6E7681" strokeWidth="1.3"/><path d="M6 13C6 13.83 6.67 14.5 7.5 14.5S9 13.83 9 13" stroke="#6E7681" strokeWidth="1.3"/></svg>
            <span style={{ position: "absolute", top: "7px", right: "7px", width: "5px", height: "5px", borderRadius: "50%", background: "#DC2626", border: "1px solid white" }} />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: "20px 28px", display: "flex", flexDirection: "column", gap: "18px" }}>

        {/* ── AI Alert Banner ── */}
        {bannerVisible && (
          <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 18px", borderRadius: "12px", background: "linear-gradient(90deg, #0F0B2A 0%, #1A1040 100%)", border: "1px solid rgba(99,102,241,0.25)" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "rgba(99,102,241,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 5.5V11.5H12V5.5L6.5 1.5Z" fill="#818CF8" opacity="0.85"/><path d="M4.5 8.5L6 10L8.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#818CF8", letterSpacing: "0.1em", textTransform: "uppercase", flexShrink: 0 }}>AI Intelligence</span>
              <span style={{ width: "1px", height: "12px", background: "rgba(255,255,255,0.1)", flexShrink: 0 }} />
              <span style={{ fontSize: "12.5px", color: "rgba(255,255,255,0.72)", lineHeight: 1.4 }}>
                <strong style={{ color: "white", fontWeight: 600 }}>5 cases flagged</strong> for immediate attention — <strong style={{ color: "#FCA5A5" }}>W.P.(CRL) 267/2024</strong> requires same-day listing · habeas corpus, 28-day detention breach.
              </span>
            </div>
            <button
              onClick={() => onNavigate("backlog")}
              style={{ padding: "6px 12px", borderRadius: "7px", background: "rgba(99,102,241,0.22)", border: "1px solid rgba(99,102,241,0.3)", color: "#A5B4FC", fontSize: "11.5px", fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
            >
              Review All
            </button>
            <button onClick={() => setBannerVisible(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.25)", cursor: "pointer", flexShrink: 0, padding: "4px" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
          </div>
        )}

        {/* ── KPI Cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
          {[
            {
              label: "Active Cases",
              value: "247",
              delta: "+12 this week",
              positive: true,
              sparkData: [198, 205, 218, 212, 224, 231, 238, 247],
              color: "#4F46E5",
              fill: "rgba(79,70,229,0.06)",
            },
            {
              label: "Pending Judgments",
              value: "38",
              delta: "5 reserved today",
              positive: null,
              sparkData: [44, 42, 46, 41, 40, 43, 40, 38],
              color: "#D97706",
              fill: "rgba(217,119,6,0.06)",
            },
            {
              label: "AI Prioritized Today",
              value: "64",
              delta: "↑ 8% vs yesterday",
              positive: true,
              sparkData: [51, 55, 58, 61, 57, 60, 62, 64],
              color: "#059669",
              fill: "rgba(5,150,105,0.06)",
            },
            {
              label: "Avg. Pendency",
              value: "4.2 yrs",
              delta: "↓ 0.3 yrs this qtr",
              positive: true,
              sparkData: [4.8, 4.7, 4.65, 4.6, 4.5, 4.4, 4.3, 4.2],
              color: "#7C3AED",
              fill: "rgba(124,58,237,0.06)",
            },
          ].map((card, i) => (
            <div key={i} style={{ background: "white", border: "1px solid #E8EAED", borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "0" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#8C929A", textTransform: "uppercase", letterSpacing: "0.07em" }}>{card.label}</span>
                <Sparkline data={card.sparkData} color={card.color} fill={card.fill} />
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#0D1117", letterSpacing: "-1.2px", lineHeight: 1 }}>{card.value}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "7px" }}>
                <span style={{ fontSize: "11px", color: card.positive === true ? "#059669" : card.positive === false ? "#DC2626" : "#8C929A", fontWeight: 500 }}>
                  {card.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main content grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 316px", gap: "14px", flex: 1 }}>

          {/* Priority Case Queue */}
          <div style={{ background: "white", border: "1px solid #E8EAED", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            {/* Card header */}
            <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid #F1F3F5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: "13.5px", fontWeight: 700, color: "#0D1117", margin: 0, letterSpacing: "-0.2px" }}>Priority Case Queue</h2>
                <p style={{ fontSize: "11px", color: "#8C929A", margin: "2px 0 0" }}>AI-ranked by urgency score · refreshed 5 min ago</p>
              </div>
              <button
                onClick={() => onNavigate("backlog")}
                style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "11.5px", fontWeight: 600, color: "#4F46E5", background: "#EEF2FF", border: "none", padding: "6px 10px", borderRadius: "7px", cursor: "pointer" }}
              >
                View all 247
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 5H7M5.5 3L7 5L5.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            {/* Table header */}
            <div style={{ display: "grid", gridTemplateColumns: "40px 1fr 90px 80px", gap: "0", padding: "8px 20px", background: "#FAFBFC", borderBottom: "1px solid #F1F3F5" }}>
              {["Score", "Case", "Next Date", "Status"].map(h => (
                <span key={h} style={{ fontSize: "10px", fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</span>
              ))}
            </div>

            {/* Rows */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {cases.map((c, i) => {
                const p = PRIORITY[c.priority];
                const s = STATUS[c.status];
                const hovered = hoveredRow === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => onNavigate("detail", c)}
                    onMouseEnter={() => setHoveredRow(c.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "40px 1fr 90px 80px",
                      gap: "0",
                      padding: "11px 20px",
                      borderBottom: i < cases.length - 1 ? "1px solid #F4F5F7" : "none",
                      background: hovered ? "#FAFAFF" : "white",
                      cursor: "pointer",
                      transition: "background 0.1s",
                      alignItems: "center",
                    }}
                  >
                    {/* Score */}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                      <span style={{ fontSize: "15px", fontWeight: 800, color: p.color, letterSpacing: "-0.5px", lineHeight: 1 }}>{c.score}</span>
                    </div>

                    {/* Case info */}
                    <div style={{ minWidth: 0, paddingRight: "12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10px", color: "#9CA3AF" }}>{c.id}</span>
                        <span style={{ fontSize: "9.5px", fontWeight: 700, padding: "1px 5px", borderRadius: "4px", background: p.bg, color: p.color, border: `1px solid ${p.border}`, letterSpacing: "0.04em" }}>
                          {p.label.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#0D1117", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginBottom: "3px", letterSpacing: "-0.1px" }}>
                        {c.title}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "11px", color: "#8C929A" }}>
                        <span>{c.judge}</span>
                        {c.aiFlag && (
                          <>
                            <span style={{ color: "#E8EAED" }}>·</span>
                            <span style={{ color: "#818CF8", display: "flex", alignItems: "center", gap: "4px" }}>
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M4 1L0.5 3.5V7.5H7.5V3.5L4 1Z" fill="#818CF8" opacity="0.9"/></svg>
                              {c.aiFlag}
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Next date */}
                    <div style={{ fontSize: "12px", color: "#6E7681", fontWeight: 500 }}>{c.nextDate}</div>

                    {/* Status */}
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: s.dot, flexShrink: 0 }} />
                      <span style={{ fontSize: "11.5px", color: "#6E7681", fontWeight: 500 }}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* AI Insights */}
            <div style={{ background: "white", border: "1px solid #E8EAED", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "13px 16px 11px", borderBottom: "1px solid #F1F3F5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <div style={{ width: "20px", height: "20px", borderRadius: "5px", background: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L1 4V9H9V4L5 1Z" fill="#4F46E5" opacity="0.9"/></svg>
                  </div>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#0D1117", letterSpacing: "-0.2px" }}>AI Insights</span>
                </div>
                <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "100px", background: "#F0FDF4", color: "#059669" }}>3 new</span>
              </div>
              <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
                {INSIGHTS.map((ins, i) => {
                  const c = insightColors[ins.type];
                  return (
                    <div key={i} style={{ padding: "10px 11px", borderRadius: "9px", background: c.bg, border: `1px solid ${c.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "5px" }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: c.dot, flexShrink: 0 }} />
                        <span style={{ fontSize: "11.5px", fontWeight: 700, color: "#0D1117", letterSpacing: "-0.1px" }}>{ins.heading}</span>
                      </div>
                      <p style={{ fontSize: "11.5px", color: "#6E7681", lineHeight: "1.55", margin: "0 0 7px 11px" }}>{ins.body}</p>
                      <button style={{ fontSize: "11px", fontWeight: 600, color: c.action, background: "none", border: "none", cursor: "pointer", padding: "0 0 0 11px", display: "flex", alignItems: "center", gap: "3px" }}>
                        {ins.action}
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 5H7M5.5 3.5L7 5L5.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Today's Cause List */}
            <div style={{ background: "white", border: "1px solid #E8EAED", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ padding: "13px 16px 11px", borderBottom: "1px solid #F1F3F5", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "#0D1117", letterSpacing: "-0.2px" }}>Today's Cause List</span>
                <span style={{ fontSize: "11px", color: "#8C929A" }}>Court 7</span>
              </div>
              <div style={{ padding: "8px 14px" }}>
                {causeList.map((item, i) => {
                  const s = STATUS[item.status];
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 2px",
                        borderBottom: i < causeList.length - 1 ? "1px solid #F4F5F7" : "none",
                        cursor: "pointer",
                      }}
                    >
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "10.5px", color: "#9CA3AF", flexShrink: 0, width: "58px" }}>{item.time}</span>
                      <div style={{ width: "1px", height: "24px", background: "#E8EAED", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", fontWeight: 600, color: "#374151", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.id}</div>
                        <div style={{ fontSize: "10.5px", color: "#9CA3AF", marginTop: "1px" }}>{item.type}</div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                        <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: s.dot }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Court Performance */}
            <div style={{ background: "#0B0D14", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "12px", padding: "15px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "rgba(255,255,255,0.28)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Court Performance</span>
                <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.2)" }}>FY 2025–26</span>
              </div>
              {[
                { label: "Disposal Rate",    value: "68%", pct: 68, color: "#4F46E5" },
                { label: "Institution Rate", value: "84%", pct: 84, color: "#2563EB" },
                { label: "AI Accuracy",      value: "91%", pct: 91, color: "#059669" },
              ].map((m, i) => (
                <div key={i} style={{ marginBottom: i < 2 ? "13px" : "0" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11.5px", color: "rgba(255,255,255,0.45)" }}>{m.label}</span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "white" }}>{m.value}</span>
                  </div>
                  <div style={{ height: "3px", borderRadius: "100px", background: "rgba(255,255,255,0.07)" }}>
                    <div style={{ height: "3px", borderRadius: "100px", width: `${m.pct}%`, background: m.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
