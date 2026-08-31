import { useState } from "react";

interface DashboardProps {
  onNavigate: (view: string, data?: unknown) => void;
  userName?: string;
}

function Sparkline({ data, color, fill }: { data: number[]; color: string; fill: string }) {
  const w = 84;
  const h = 30;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 6) - 3;
    return `${x},${y}`;
  });
  const pathD = `M ${pts.join(" L ")}`;
  const fillD = `M 0,${h} L ${pts.join(" L ")} L ${w},${h} Z`;
  const [lastX, lastY] = pts[pts.length - 1].split(",");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={fillD} fill={fill} />
      <path d={pathD} stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

const cases = [
  {
    id: "W.P.(CRL) 267/2024",
    title: "Ananya Singh vs. State of NCT of Delhi",
    judge: "Justice P. Krishnamurthy",
    priority: "critical" as const,
    score: 96,
    status: "urgent" as const,
    nextDate: "02 Sep 2026",
    aiFlag: "Bail matter, expedited hearing required",
  },
  {
    id: "WP(C) 4821/2024",
    title: "Sharma vs. Union of India",
    judge: "Justice R. Sharma",
    priority: "critical" as const,
    score: 94,
    status: "hearing" as const,
    nextDate: "04 Sep 2026",
    aiFlag: "Liberty at risk, habeas corpus pending",
  },
  {
    id: "CRL.A. 1127/2023",
    title: "State of UP vs. Mohammad Farooqui",
    judge: "Justice K. Mehta",
    priority: "high" as const,
    score: 87,
    status: "reserved" as const,
    nextDate: "11 Sep 2026",
    aiFlag: "Judgment reserved, POCSO implications",
  },
  {
    id: "CS(COMM) 302/2024",
    title: "Tata Consultancy Services vs. Infosys Ltd.",
    judge: "Justice S. Kumar",
    priority: "high" as const,
    score: 82,
    status: "arguments" as const,
    nextDate: "06 Sep 2026",
    aiFlag: "IP dispute, high-value commercial impact",
  },
  {
    id: "FAO(OS) 88/2023",
    title: "Mehta Family Trust vs. NBCC India Ltd.",
    judge: "Justice R. Sharma",
    priority: "medium" as const,
    score: 63,
    status: "pending" as const,
    nextDate: "18 Sep 2026",
    aiFlag: "Property dispute with long pendency",
  },
];

const PRIORITY = {
  critical: { label: "Critical", color: "#dc2626", bg: "rgba(220,38,38,0.08)", border: "rgba(220,38,38,0.18)" },
  high: { label: "High", color: "#d97706", bg: "rgba(217,119,6,0.08)", border: "rgba(217,119,6,0.18)" },
  medium: { label: "Medium", color: "#2563eb", bg: "rgba(37,99,235,0.08)", border: "rgba(37,99,235,0.18)" },
  low: { label: "Low", color: "#6b7280", bg: "rgba(107,114,128,0.06)", border: "rgba(107,114,128,0.12)" },
};

const STATUS = {
  urgent: { label: "Urgent", dot: "#dc2626" },
  hearing: { label: "In Hearing", dot: "#2563eb" },
  reserved: { label: "Reserved", dot: "#d97706" },
  arguments: { label: "Arguments", dot: "#059669" },
  pending: { label: "Pending", dot: "#9ca3af" },
};

const INSIGHTS = [
  {
    type: "alert" as const,
    heading: "Bail deadline breach approaching",
    body: "3 cases with bail petitions are nearing the 60-day statutory limit under CrPC Section 167.",
    action: "Review cases",
  },
  {
    type: "suggest" as const,
    heading: "Case cluster detected",
    body: "12 property dispute writs share near-identical facts. A single bench order could dispose all.",
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
  alert: { border: "#fca5a5", bg: "#fff5f5", dot: "#dc2626", action: "#dc2626" },
  suggest: { border: "#6ee7b7", bg: "#f0fdf9", dot: "#059669", action: "#059669" },
  info: { border: "#c7d2fe", bg: "#f5f7ff", dot: "#4f46e5", action: "#4f46e5" },
};

const causeList = [
  { time: "10:30 AM", id: "W.P.(CRL) 267/2024", type: "Bail Hearing", status: "urgent" as const },
  { time: "11:00 AM", id: "CS(COMM) 302/2024", type: "Arguments", status: "arguments" as const },
  { time: "02:00 PM", id: "WP(C) 4821/2024", type: "Main Hearing", status: "hearing" as const },
  { time: "03:30 PM", id: "FAO 558/2022", type: "Pronouncement", status: "reserved" as const },
];

function toTitleCase(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function getGreeting(hour: number): string {
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function Dashboard({ onNavigate, userName = "Justice Sharma" }: DashboardProps) {
  const [bannerVisible, setBannerVisible] = useState(true);
  const [activeRow, setActiveRow] = useState<string | null>(null);
  const [showCaseModal, setShowCaseModal] = useState(false);
  const [newCaseTitle, setNewCaseTitle] = useState("");
  const [newCaseType, setNewCaseType] = useState("Writ (Civil)");
  const [newCasePriority, setNewCasePriority] = useState<"critical" | "high" | "medium" | "low">("medium");
  const [newCaseDate, setNewCaseDate] = useState("");
  const [newCaseError, setNewCaseError] = useState<string | null>(null);

  const now = new Date();
  const greeting = getGreeting(now.getHours());
  const displayName = toTitleCase(userName || "Judge");
  const prettyDate = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const openNewCaseModal = () => {
    setShowCaseModal(true);
    setNewCaseError(null);
  };

  const closeNewCaseModal = () => {
    setShowCaseModal(false);
    setNewCaseError(null);
  };

  const createCase = () => {
    if (!newCaseTitle.trim()) {
      setNewCaseError("Case title is required.");
      return;
    }
    if (!newCaseDate) {
      setNewCaseError("Next hearing date is required.");
      return;
    }

    const caseId = `NEW/${now.getFullYear()}/${Math.floor(Math.random() * 9000 + 1000)}`;
    const nextDate = new Date(newCaseDate).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const createdCase = {
      id: caseId,
      title: newCaseTitle.trim(),
      type: newCaseType,
      judge: displayName,
      priority: newCasePriority,
      score: newCasePriority === "critical" ? 90 : newCasePriority === "high" ? 78 : newCasePriority === "medium" ? 64 : 45,
      status: "pending",
      nextDate,
      acts: ["To be updated"],
      petitioner: "To be added",
      respondent: "To be added",
      aiFlag: "Newly filed matter",
      age: "0 days",
      court: "Delhi HC",
    };

    closeNewCaseModal();
    setNewCaseTitle("");
    setNewCaseDate("");
    setNewCaseType("Writ (Civil)");
    setNewCasePriority("medium");
    onNavigate("detail", createdCase);
  };

  return (
    <div className="view-enter flex h-full flex-col overflow-y-auto bg-transparent">
      <div className="sticky top-0 z-10 border-b border-slate-200/80 bg-white/92 px-4 py-4 backdrop-blur-sm md:px-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="m-0 text-xl font-extrabold tracking-tight text-slate-900 md:text-2xl">{greeting}, {displayName}</h1>
            <p className="mt-1 text-xs font-medium text-slate-500 md:text-sm">
              {prettyDate} · Delhi High Court · Division Bench II · Court 7
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate("search")}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:border-teal-300 hover:text-teal-700 md:px-3.5 md:text-sm"
            >
              <svg width="14" height="14" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.4"/><path d="M9 9L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              Search precedents
              <kbd className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] text-slate-400">Ctrl K</kbd>
            </button>

            <button
              onClick={openNewCaseModal}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-transform hover:-translate-y-px md:text-sm"
            >
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1V10M1 5.5H10" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
              New Case
            </button>

            <button className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500">
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1C5.3 1 3.5 2.8 3.5 5V9.5L2 11V11.5H13V11L11.5 9.5V5C11.5 2.8 9.7 1 7.5 1Z" stroke="currentColor" strokeWidth="1.3"/><path d="M6 13C6 13.83 6.67 14.5 7.5 14.5S9 13.83 9 13" stroke="currentColor" strokeWidth="1.3"/></svg>
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full border border-white bg-rose-500" />
            </button>
          </div>
        </div>
      </div>

      {showCaseModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-900/45 px-4">
          <div className="surface-elevated w-full max-w-lg rounded-2xl p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold tracking-tight text-slate-900">Create New Case</h3>
              <button onClick={closeNewCaseModal} className="rounded-md p-1 text-slate-500 hover:bg-slate-100">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              </button>
            </div>

            <div className="space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Case title</span>
                <input
                  value={newCaseTitle}
                  onChange={(e) => setNewCaseTitle(e.target.value)}
                  placeholder="Example: A vs State of Delhi"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Case type</span>
                  <select
                    value={newCaseType}
                    onChange={(e) => setNewCaseType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  >
                    {[
                      "Writ (Civil)",
                      "Writ (Criminal)",
                      "Criminal Appeal",
                      "Commercial Suit",
                      "First Appeal",
                    ].map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Priority</span>
                  <select
                    value={newCasePriority}
                    onChange={(e) => setNewCasePriority(e.target.value as "critical" | "high" | "medium" | "low")}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                  >
                    {[
                      "critical",
                      "high",
                      "medium",
                      "low",
                    ].map((option) => (
                      <option key={option} value={option}>{option[0].toUpperCase() + option.slice(1)}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Next hearing date</span>
                <input
                  type="date"
                  value={newCaseDate}
                  onChange={(e) => setNewCaseDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none"
                />
              </label>
            </div>

            {newCaseError && (
              <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {newCaseError}
              </div>
            )}

            <div className="mt-4 flex items-center justify-end gap-2">
              <button onClick={closeNewCaseModal} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600">Cancel</button>
              <button onClick={createCase} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Case</button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 px-4 py-4 md:gap-5 md:px-7 md:py-5">
        {bannerVisible && (
          <div className="relative overflow-hidden rounded-2xl border border-slate-800/70 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-900/80 p-4">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-teal-400/20 blur-2xl" />
            <div className="relative flex flex-col gap-3 md:flex-row md:items-center">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1.5L1 5.5V11.5H12V5.5L6.5 1.5Z" fill="#5eead4" opacity="0.85"/><path d="M4.5 8.5L6 10L8.5 7" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-300">AI Intelligence</span>
                <span className="hidden h-3 w-px bg-white/20 md:block" />
                <span className="text-sm text-white/80 md:text-[15px]">
                  <strong className="font-semibold text-white">5 cases flagged</strong> for immediate attention, including
                  <strong className="font-semibold text-rose-300"> W.P.(CRL) 267/2024</strong>.
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={() => onNavigate("backlog")}
                  className="rounded-lg border border-teal-300/30 bg-teal-300/10 px-3 py-1.5 text-xs font-semibold text-teal-200"
                >
                  Review All
                </button>
                <button onClick={() => setBannerVisible(false)} className="rounded-md p-1 text-white/45 hover:bg-white/10 hover:text-white/70">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3L11 11M11 3L3 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Active Cases",
              value: "247",
              delta: "+12 this week",
              positive: true,
              sparkData: [198, 205, 218, 212, 224, 231, 238, 247],
              color: "#0d9488",
              fill: "rgba(13,148,136,0.08)",
            },
            {
              label: "Pending Judgments",
              value: "38",
              delta: "5 reserved today",
              positive: null,
              sparkData: [44, 42, 46, 41, 40, 43, 40, 38],
              color: "#d97706",
              fill: "rgba(217,119,6,0.08)",
            },
            {
              label: "AI Prioritized Today",
              value: "64",
              delta: "8% vs yesterday",
              positive: true,
              sparkData: [51, 55, 58, 61, 57, 60, 62, 64],
              color: "#059669",
              fill: "rgba(5,150,105,0.08)",
            },
            {
              label: "Average Pendency",
              value: "4.2 yrs",
              delta: "0.3 yrs lower this quarter",
              positive: true,
              sparkData: [4.8, 4.7, 4.65, 4.6, 4.5, 4.4, 4.3, 4.2],
              color: "#0f172a",
              fill: "rgba(15,23,42,0.07)",
            },
          ].map((card, i) => (
            <div key={i} className="surface-elevated rounded-2xl p-4 md:p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">{card.label}</span>
                <Sparkline data={card.sparkData} color={card.color} fill={card.fill} />
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-slate-900">{card.value}</div>
              <div className={`mt-2 text-sm font-semibold ${card.positive === true ? "text-emerald-600" : card.positive === false ? "text-rose-600" : "text-slate-500"}`}>
                {card.delta}
              </div>
            </div>
          ))}
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_330px]">
          <div className="surface-elevated flex min-h-[420px] flex-col overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="m-0 text-lg font-bold tracking-tight text-slate-900">Priority Case Queue</h2>
                <p className="mt-1 text-xs text-slate-500">AI-ranked by urgency score · refreshed 5 minutes ago</p>
              </div>
              <button
                onClick={() => onNavigate("backlog")}
                className="inline-flex items-center gap-1 self-start rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700"
              >
                View all 247
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 5H7M5.5 3L7 5L5.5 7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>

            <div className="grid grid-cols-[48px_minmax(0,1fr)_100px_88px] bg-slate-50 px-5 py-2 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
              {["Score", "Case", "Next Date", "Status"].map((h) => <span key={h}>{h}</span>)}
            </div>

            <div className="flex-1 overflow-y-auto">
              {cases.map((c, i) => {
                const p = PRIORITY[c.priority];
                const s = STATUS[c.status];
                const isActive = activeRow === c.id;

                return (
                  <div
                    key={c.id}
                    onClick={() => onNavigate("detail", c)}
                    onMouseEnter={() => setActiveRow(c.id)}
                    onMouseLeave={() => setActiveRow(null)}
                    className={`grid cursor-pointer grid-cols-[48px_minmax(0,1fr)_100px_88px] items-center gap-0 px-5 py-3 transition-colors ${isActive ? "bg-teal-50/60" : "bg-white"} ${i < cases.length - 1 ? "border-b border-slate-100" : ""}`}
                  >
                    <div className="text-xl font-extrabold tracking-tight" style={{ color: p.color }}>{c.score}</div>

                    <div className="min-w-0 pr-3">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-slate-400">{c.id}</span>
                        <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.07em]" style={{ background: p.bg, color: p.color, border: `1px solid ${p.border}` }}>
                          {p.label}
                        </span>
                      </div>
                      <div className="truncate text-[15px] font-semibold tracking-tight text-slate-900">{c.title}</div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{c.judge}</span>
                        <span className="text-slate-300">·</span>
                        <span className="truncate text-teal-700">{c.aiFlag}</span>
                      </div>
                    </div>

                    <div className="text-sm font-medium text-slate-600">{c.nextDate}</div>

                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
                      <span className="text-sm text-slate-600">{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="surface-elevated overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-100 text-teal-700">
                    <svg width="11" height="11" viewBox="0 0 10 10" fill="none"><path d="M5 1L1 4V9H9V4L5 1Z" fill="currentColor" opacity="0.9"/></svg>
                  </div>
                  <span className="text-base font-bold tracking-tight text-slate-900">AI Insights</span>
                </div>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">3 new</span>
              </div>
              <div className="flex flex-col gap-2 p-3">
                {INSIGHTS.map((ins, i) => {
                  const c = insightColors[ins.type];
                  return (
                    <div key={i} className="rounded-xl p-3" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                      <div className="mb-1.5 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full" style={{ background: c.dot }} />
                        <span className="text-[15px] font-semibold tracking-tight text-slate-900">{ins.heading}</span>
                      </div>
                      <p className="mb-2 text-sm leading-6 text-slate-600">{ins.body}</p>
                      <button className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: c.action }}>
                        {ins.action}
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 5H7M5.5 3.5L7 5L5.5 6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="surface-elevated overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-base font-bold tracking-tight text-slate-900">Today's Cause List</span>
                <span className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-400">Court 7</span>
              </div>
              <div className="px-4 py-2">
                {causeList.map((item, i) => {
                  const s = STATUS[item.status];
                  return (
                    <div key={i} className={`flex items-center gap-3 py-2 ${i < causeList.length - 1 ? "border-b border-slate-100" : ""}`}>
                      <span className="w-16 shrink-0 font-mono text-[11px] text-slate-400">{item.time}</span>
                      <div className="h-6 w-px bg-slate-200" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-mono text-[11px] font-semibold text-slate-700">{item.id}</div>
                        <div className="text-xs text-slate-500">{item.type}</div>
                      </div>
                      <div className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot }} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 px-4 py-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">Court Performance</span>
                <span className="text-[10px] text-slate-500">FY 2025-26</span>
              </div>
              {[
                { label: "Disposal Rate", value: "68%", pct: 68, color: "#14b8a6" },
                { label: "Institution Rate", value: "84%", pct: 84, color: "#38bdf8" },
                { label: "AI Accuracy", value: "91%", pct: 91, color: "#22c55e" },
              ].map((m, i) => (
                <div key={i} className={i < 2 ? "mb-3.5" : ""}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-xs text-slate-300">{m.label}</span>
                    <span className="text-xs font-bold text-white">{m.value}</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10">
                    <div className="h-1 rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
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
