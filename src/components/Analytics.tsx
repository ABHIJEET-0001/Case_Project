import { useState } from "react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
const disposalData = [42, 38, 55, 61, 48, 72, 65, 58];
const institutionData = [68, 74, 62, 80, 71, 85, 78, 72];
const maxBarVal = Math.max(...disposalData, ...institutionData);
const BAR_H = 130;

const caseTypeData = [
  { type: "Civil Writs", count: 89, pct: 36, color: "#6366F1" },
  { type: "Criminal Appeals", count: 54, pct: 22, color: "#F59E0B" },
  { type: "Commercial Suits", count: 41, pct: 17, color: "#10B981" },
  { type: "First Appeals", count: 38, pct: 15, color: "#3B82F6" },
  { type: "Other", count: 25, pct: 10, color: "#D1D5DB" },
];

const pendencyBrackets = [
  { label: "0–1 yr", count: 23, fill: "#10B981" },
  { label: "1–2 yr", count: 41, fill: "#3B82F6" },
  { label: "2–5 yr", count: 97, fill: "#F59E0B" },
  { label: "5–10 yr", count: 62, fill: "#EF4444" },
  { label: "10+ yr", count: 24, fill: "#7C3AED" },
];
const maxPendency = Math.max(...pendencyBrackets.map(x => x.count));

const judgeData = [
  { name: "Justice R. Sharma", disposed: 28, pending: 84, score: 92, initials: "RS" },
  { name: "Justice K. Mehta", disposed: 22, pending: 71, score: 88, initials: "KM" },
  { name: "Justice S. Kumar", disposed: 19, pending: 62, score: 84, initials: "SK" },
  { name: "Justice P. Krishnamurthy", disposed: 15, pending: 55, score: 79, initials: "PK" },
];

const scoreColors = ["#6366F1", "#3B82F6", "#10B981", "#F59E0B"];

export default function Analytics() {
  const [period, setPeriod] = useState("FY 2025–26");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  const periods = ["This Quarter", "FY 2025–26", "Last 3 Years"];

  // Build donut paths
  const cx = 56, cy = 56, r = 42, sw = 20;
  const circ = 2 * Math.PI * r;
  let cumPct = 0;

  return (
    <div className="page-shell fade-in">
      <div className="page-head">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Analytics</h1>
            <p className="mt-1 text-xs text-slate-500">Delhi High Court · Division Bench II · {period}</p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {periods.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="rounded-xl px-3 py-1.5 text-xs font-semibold transition-all"
                style={{ background: period === p ? "#0f172a" : "white", color: period === p ? "white" : "#64748b", border: `1px solid ${period === p ? "#0f172a" : "#e2e8f0"}` }}
              >
                {p}
              </button>
            ))}
            <button className="ml-2 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 4H10M3.5 7H8.5M5 10H7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
              </svg>
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="page-content flex flex-col gap-5">
        {/* KPI Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            { label: "Total Cases", value: "247", sub: "Active docket", color: "#3B82F6", trend: null },
            { label: "Disposed YTD", value: "184", sub: "FY 2025–26", color: "#10B981", trend: "+12%" },
            { label: "Pending >5 yrs", value: "86", sub: "34.8% of docket", color: "#EF4444", trend: "-4%" },
            { label: "Disposal Rate", value: "68%", sub: "↑ 6% vs last FY", color: "#F59E0B", trend: "+6pp" },
            { label: "Avg. Pendency", value: "4.2 yr", sub: "↓ 0.3 yr vs last", color: "#8B5CF6", trend: "-7%" },
          ].map((stat, i) => (
            <div key={i} className="surface-elevated rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider" style={{ fontSize: "10px" }}>{stat.label}</span>
                {stat.trend && (
                  <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{
                    background: stat.trend.startsWith("+") && !stat.label.includes(">5") ? "#F0FDF4" : "#FFF1F2",
                    color: stat.trend.startsWith("+") && !stat.label.includes(">5") ? "#16A34A" : "#E11D48",
                    fontSize: "10px"
                  }}>
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="font-bold mb-1" style={{ fontSize: "24px", letterSpacing: "-0.8px", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
              <div className="text-xs text-gray-400" style={{ fontSize: "11px" }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid gap-5 xl:grid-cols-2">
          {/* Bar chart */}
          <div className="surface-elevated rounded-2xl p-5">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Institution vs. Disposal</h3>
                <p className="text-xs text-gray-400 mt-0.5">Monthly filings and disposals · {period}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#E0E7FF" }} />
                  <span className="text-xs text-gray-400">Instituted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#6366F1" }} />
                  <span className="text-xs text-gray-400">Disposed</span>
                </div>
              </div>
            </div>
            <div className="flex items-end gap-2" style={{ height: `${BAR_H + 24}px` }}>
              {months.map((month, i) => {
                const instH = Math.round((institutionData[i] / maxBarVal) * BAR_H);
                const dispH = Math.round((disposalData[i] / maxBarVal) * BAR_H);
                const isHovered = hoveredBar === i;
                return (
                  <div
                    key={month}
                    className="flex-1 flex flex-col items-center gap-1 cursor-pointer"
                    onMouseEnter={() => setHoveredBar(i)}
                    onMouseLeave={() => setHoveredBar(null)}
                  >
                    {isHovered && (
                      <div className="absolute z-10 px-2 py-1 rounded-lg text-xs pointer-events-none" style={{ background: "#1D2330", color: "white", marginTop: "-28px", fontSize: "10px" }}>
                        {disposalData[i]} / {institutionData[i]}
                      </div>
                    )}
                    <div className="w-full flex items-end gap-0.5 relative" style={{ height: `${BAR_H}px` }}>
                      <div
                        className="flex-1 rounded-t-md transition-all"
                        style={{ height: `${instH}px`, background: isHovered ? "#C7D2FE" : "#E0E7FF" }}
                      />
                      <div
                        className="flex-1 rounded-t-md transition-all"
                        style={{ height: `${dispH}px`, background: isHovered ? "#4F46E5" : "#6366F1" }}
                      />
                    </div>
                    <span className="text-xs text-gray-400" style={{ fontSize: "10px" }}>{month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Donut chart */}
          <div className="surface-elevated rounded-2xl p-5">
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">Case Type Breakdown</h3>
              <p className="text-xs text-gray-400 mt-0.5">247 total cases by category</p>
            </div>
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-6">
              <svg width="112" height="112" viewBox="0 0 112 112" style={{ flexShrink: 0, overflow: "visible" }}>
                {caseTypeData.map((item, i) => {
                  const startPct = cumPct;
                  cumPct += item.pct;
                  const dash = (item.pct / 100) * circ;
                  const offset = circ - (startPct / 100) * circ;
                  const isHovered = hoveredSlice === i;
                  return (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="none"
                      stroke={item.color}
                      strokeWidth={isHovered ? sw + 3 : sw}
                      strokeDasharray={`${dash} ${circ - dash}`}
                      strokeDashoffset={offset}
                      style={{ transformOrigin: `${cx}px ${cy}px`, transform: "rotate(-90deg)", cursor: "pointer", transition: "stroke-width 0.15s ease" }}
                      onMouseEnter={() => setHoveredSlice(i)}
                      onMouseLeave={() => setHoveredSlice(null)}
                    />
                  );
                })}
                {hoveredSlice !== null ? (
                  <>
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="700" fill="#111827">{caseTypeData[hoveredSlice].count}</text>
                    <text x={cx} y={cy + 9} textAnchor="middle" fontSize="9" fill="#9CA3AF">{caseTypeData[hoveredSlice].pct}%</text>
                  </>
                ) : (
                  <>
                    <text x={cx} y={cy - 6} textAnchor="middle" fontSize="16" fontWeight="800" fill="#111827">247</text>
                    <text x={cx} y={cy + 9} textAnchor="middle" fontSize="9" fill="#9CA3AF">cases</text>
                  </>
                )}
              </svg>
              <div className="flex flex-col gap-2 flex-1">
                {caseTypeData.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 cursor-pointer py-0.5 rounded transition-colors px-1 -mx-1"
                    style={{ background: hoveredSlice === i ? "#FAFAFA" : "transparent" }}
                    onMouseEnter={() => setHoveredSlice(i)}
                    onMouseLeave={() => setHoveredSlice(null)}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-gray-600 flex-1">{item.type}</span>
                    <span className="text-xs font-bold text-gray-900">{item.count}</span>
                    <span className="text-xs text-gray-400 w-7 text-right" style={{ fontSize: "10px" }}>{item.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-2">
          {/* Pendency brackets */}
          <div className="surface-elevated rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Age Bracket Distribution</h3>
            <p className="text-xs text-gray-400 mb-5">Pendency of cases by age</p>
            <div className="flex flex-col gap-3.5">
              {pendencyBrackets.map(item => {
                const w = Math.round((item.count / maxPendency) * 100);
                return (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 flex-shrink-0" style={{ width: "48px" }}>{item.label}</span>
                    <div className="flex-1 h-6 rounded-lg overflow-hidden" style={{ background: "#F3F4F6" }}>
                      <div
                        className="h-full rounded-lg flex items-center px-2 transition-all"
                        style={{ width: `${w}%`, background: item.fill, minWidth: "28px" }}
                      >
                        <span className="text-xs font-bold text-white" style={{ fontSize: "11px" }}>{item.count}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0 w-8 text-right" style={{ fontSize: "10px" }}>{Math.round((item.count / 247) * 100)}%</span>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 flex items-start gap-2.5 rounded-xl px-3 py-2.5" style={{ background: "#FFF8F8", border: "1px solid #FEE2E2" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0 mt-0.5">
                <path d="M6.5 1L0.5 11.5H12.5L6.5 1Z" stroke="#EF4444" strokeWidth="1.2" strokeLinejoin="round"/>
                <path d="M6.5 5V8" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round"/>
                <circle cx="6.5" cy="10" r="0.7" fill="#EF4444"/>
              </svg>
              <span className="text-xs text-red-600" style={{ lineHeight: "1.5" }}>86 cases (34.8%) pending over 5 years — review and Lok Adalat referral recommended</span>
            </div>
          </div>

          {/* Bench performance */}
          <div className="surface-elevated rounded-2xl p-5">
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Bench Performance</h3>
            <p className="text-xs text-gray-400 mb-5">Disposal metrics · {period}</p>
            <div className="flex flex-col gap-4">
              {judgeData.map((judge, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: scoreColors[i] + "18", color: scoreColors[i] }}
                  >
                    {judge.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-gray-800 truncate">{judge.name}</span>
                      <span className="text-xs font-bold ml-2 flex-shrink-0" style={{ color: "#10B981" }}>{judge.disposed} disposed</span>
                    </div>
                    <div className="h-1.5 rounded-full mb-1" style={{ background: "#F3F4F6" }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${judge.score}%`, background: scoreColors[i] }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">{judge.pending} pending</span>
                      <span className="text-xs text-gray-400">Score {judge.score}/100</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(99,102,241,0.2)" }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1L1 5V12H12V5L6.5 1Z" fill="#818CF8" opacity="0.9"/>
              </svg>
            </div>
            <span className="text-xs font-bold tracking-widest" style={{ color: "#818CF8", fontSize: "10px" }}>AI DOCKET RECOMMENDATIONS</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              {
                title: "Cluster similar cases",
                desc: "12 property dispute writs share near-identical factual matrices. A single common bench order could dispose all.",
                tag: "Efficiency",
                tagColor: "#10B981",
                tagBg: "rgba(16,185,129,0.15)",
              },
              {
                title: "Fast-track oldest cases",
                desc: "24 cases pending 10+ years. Recommend Special Lok Adalat referral under §89 CPC for ADR resolution.",
                tag: "Access to Justice",
                tagColor: "#F59E0B",
                tagBg: "rgba(245,158,11,0.15)",
              },
              {
                title: "Expand commercial bench",
                desc: "₹2,800 Cr+ at stake in pending commercial suits. Dedicated commercial bench would reduce pendency by ~40%.",
                tag: "Economic Impact",
                tagColor: "#6366F1",
                tagBg: "rgba(99,102,241,0.2)",
              },
            ].map((rec, i) => (
              <div key={i} className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="inline-block text-xs px-2 py-0.5 rounded-full mb-3 font-semibold" style={{ background: rec.tagBg, color: rec.tagColor, fontSize: "10px" }}>
                  {rec.tag}
                </span>
                <div className="text-sm font-semibold text-white mb-2" style={{ lineHeight: "1.3" }}>{rec.title}</div>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", lineHeight: "1.65" }}>{rec.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
