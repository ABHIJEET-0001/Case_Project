import { useState } from "react";

const reportTypes = [
  {
    id: "cause-list",
    title: "Daily Cause List",
    description: "Auto-generated cause list for Court 7 with AI-prioritized ordering.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="2" width="14" height="14" rx="2" stroke="#6366F1" strokeWidth="1.4"/>
        <path d="M5 6H13M5 9H13M5 12H9" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    color: "#6366F1",
    bg: "#EEF2FF",
    lastGenerated: "29 Aug 2026, 8:00 AM",
    frequency: "Daily",
  },
  {
    id: "pendency",
    title: "Pendency Report",
    description: "Case-wise pendency analysis with AI-flagged outliers and recommended actions.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M3 14L7 9L10 12L14 6" stroke="#F59E0B" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="14" cy="6" r="2" fill="#F59E0B"/>
      </svg>
    ),
    color: "#F59E0B",
    bg: "#FEF3C7",
    lastGenerated: "25 Aug 2026, 6:00 PM",
    frequency: "Weekly",
  },
  {
    id: "disposal",
    title: "Disposal Statistics",
    description: "Monthly and quarterly disposal numbers benchmarked against national averages.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="2" y="10" width="3" height="6" rx="1" fill="#10B981"/>
        <rect x="7" y="7" width="3" height="9" rx="1" fill="#10B981" opacity="0.6"/>
        <rect x="12" y="4" width="3" height="12" rx="1" fill="#10B981" opacity="0.4"/>
      </svg>
    ),
    color: "#10B981",
    bg: "#F0FDF4",
    lastGenerated: "01 Aug 2026, 12:00 PM",
    frequency: "Monthly",
  },
  {
    id: "ai-summary",
    title: "AI Case Summary",
    description: "AI-generated summaries for selected cases, ready for judgment preparation.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2L2 7V16H16V7L9 2Z" stroke="#8B5CF6" strokeWidth="1.4" strokeLinejoin="round"/>
        <path d="M6 11L7.5 12.5L12 9" stroke="#8B5CF6" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#8B5CF6",
    bg: "#F5F3FF",
    lastGenerated: "28 Aug 2026, 4:30 PM",
    frequency: "On demand",
  },
  {
    id: "compliance",
    title: "SC Compliance Report",
    description: "Status of all Supreme Court directions and suo motu compliance across pending matters.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="#EF4444" strokeWidth="1.4"/>
        <path d="M6 9L8 11L12 7" stroke="#EF4444" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    color: "#EF4444",
    bg: "#FEF2F2",
    lastGenerated: "20 Aug 2026, 10:00 AM",
    frequency: "Fortnightly",
  },
  {
    id: "financial",
    title: "High-Value Disputes",
    description: "Report on all commercial and financial disputes with claim values above ₹1 Crore.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 2V16M5 5H11C12.1 5 13 5.9 13 7C13 8.1 12.1 9 11 9H7C5.9 9 5 9.9 5 11C5 12.1 5.9 13 7 13H13" stroke="#3B82F6" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    color: "#3B82F6",
    bg: "#EFF6FF",
    lastGenerated: "15 Aug 2026, 2:00 PM",
    frequency: "Monthly",
  },
];

const recentReports = [
  { name: "Cause List — 29 Aug 2026.pdf", size: "340 KB", date: "Today, 8:00 AM", type: "cause-list" },
  { name: "Pendency Report — Week 34.pdf", size: "1.2 MB", date: "25 Aug 2026", type: "pendency" },
  { name: "AI Summary — WP(C) 267-2024.pdf", size: "780 KB", date: "28 Aug 2026", type: "ai-summary" },
  { name: "Disposal Stats — July 2026.pdf", size: "2.1 MB", date: "01 Aug 2026", type: "disposal" },
  { name: "SC Compliance — Aug 2026.pdf", size: "960 KB", date: "20 Aug 2026", type: "compliance" },
];

const typeColors: Record<string, string> = {
  "cause-list": "#6366F1",
  pendency: "#F59E0B",
  disposal: "#10B981",
  "ai-summary": "#8B5CF6",
  compliance: "#EF4444",
  financial: "#3B82F6",
};

export default function Reports() {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);

  const handleGenerate = (id: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      setGenerated(prev => [id, ...prev]);
    }, 2000);
  };

  return (
    <div className="page-shell fade-in">
      <div className="page-head">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Reports</h1>
            <p className="mt-1 text-xs text-slate-500">Generate, schedule, and download court reports and AI summaries</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M5.5 1V10M1 5.5H10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Schedule Report
          </button>
        </div>
      </div>

      <div className="page-content flex flex-col gap-6">
        {/* Report types grid */}
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest" style={{ fontSize: "10px" }}>Available Reports</div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {reportTypes.map(report => (
              <div
                key={report.id}
                className="surface-elevated rounded-2xl p-5 transition-all"
                style={{ borderColor: generated.includes(report.id) ? report.color + "40" : "#E5E7EB" }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: report.bg }}>
                    {report.icon}
                  </div>
                  {generated.includes(report.id) && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#F0FDF4", color: "#16A34A", fontSize: "10px" }}>Ready</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">{report.title}</h3>
                <p className="text-xs text-gray-400 mb-4" style={{ lineHeight: "1.55" }}>{report.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">{report.frequency}</span>
                  <span className="text-xs text-gray-300">·</span>
                  <span className="text-xs text-gray-400">Last: {report.lastGenerated.split(",")[0]}</span>
                </div>
                <button
                  onClick={() => handleGenerate(report.id)}
                  disabled={generating === report.id}
                  className="w-full py-2 rounded-xl text-xs font-semibold transition-all disabled:opacity-60"
                  style={{ background: report.bg, color: report.color }}
                >
                  {generating === report.id ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
                      Generating...
                    </span>
                  ) : generated.includes(report.id) ? "Download PDF" : "Generate Report"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reports */}
        <div>
          <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-widest" style={{ fontSize: "10px" }}>Recent Reports</div>
          <div className="surface-elevated overflow-hidden">
            {recentReports.map((r, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors cursor-pointer"
                style={{ borderBottom: i < recentReports.length - 1 ? "1px solid #F9FAFB" : "none" }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "#FAFAFA"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: typeColors[r.type] + "15" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <rect x="2" y="1" width="10" height="12" rx="1.5" stroke={typeColors[r.type]} strokeWidth="1.3"/>
                    <path d="M4 5H10M4 7.5H10M4 10H7" stroke={typeColors[r.type]} strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-800 truncate">{r.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{r.size} · {r.date}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: "#6B7280", background: "#F3F4F6" }}>
                    View
                  </button>
                  <button className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors" style={{ color: "#3B82F6", background: "#EFF6FF" }}>
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
