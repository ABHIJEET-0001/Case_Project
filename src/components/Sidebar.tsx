import LogoMark from "./LogoMark";

interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
}

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: (active: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1" y="1" width="5.5" height="5.5" rx="1.2" fill={active ? "white" : "currentColor"} opacity={active ? 1 : 0.6} />
        <rect x="8.5" y="1" width="5.5" height="5.5" rx="1.2" fill={active ? "white" : "currentColor"} opacity={active ? 0.5 : 0.35} />
        <rect x="1" y="8.5" width="5.5" height="5.5" rx="1.2" fill={active ? "white" : "currentColor"} opacity={active ? 0.5 : 0.35} />
        <rect x="8.5" y="8.5" width="5.5" height="5.5" rx="1.2" fill={active ? "white" : "currentColor"} opacity={active ? 1 : 0.6} />
      </svg>
    ),
  },
  {
    id: "search",
    label: "Precedent Search",
    icon: (active: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} opacity={active ? 1 : 0.6} />
        <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" opacity={active ? 1 : 0.6} />
      </svg>
    ),
  },
  {
    id: "backlog",
    label: "Case Backlog",
    badge: "247",
    icon: (active: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="1.5" y="2" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} opacity={active ? 1 : 0.6} />
        <path d="M4.5 2V0.75" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" opacity={active ? 1 : 0.6} />
        <path d="M10.5 2V0.75" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" opacity={active ? 1 : 0.6} />
        <path d="M4 7H11M4 10H8.5" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" opacity={active ? 1 : 0.6} />
      </svg>
    ),
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: (active: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <path d="M1.5 12L5 7.5L8 10.5L11.5 5.5L13.5 7" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" strokeLinejoin="round" opacity={active ? 1 : 0.6} />
      </svg>
    ),
  },
  {
    id: "reports",
    label: "Reports",
    icon: (active: boolean) => (
      <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
        <rect x="2" y="1.5" width="11" height="12" rx="1.5" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} opacity={active ? 1 : 0.6} />
        <path d="M4.5 5H10.5M4.5 7.5H10.5M4.5 10H7.5" stroke="currentColor" strokeWidth={active ? 1.8 : 1.4} strokeLinecap="round" opacity={active ? 1 : 0.6} />
      </svg>
    ),
  },
];

export default function Sidebar({
  activeView,
  onNavigate,
  isMobileOpen = false,
  onCloseMobile,
  userName = "Justice R. Sharma",
  userRole = "Judge",
  onLogout,
}: SidebarProps) {
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 backdrop-blur-[1px] transition-opacity md:hidden ${isMobileOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onCloseMobile}
      />

      <aside
        className={`
          fixed left-2 top-2 bottom-2 z-40 w-[260px] md:static md:z-auto md:w-[240px] md:min-w-[240px]
          rounded-2xl md:rounded-r-none md:rounded-l-2xl
          bg-slate-950 text-slate-300 border border-slate-800 md:border-slate-900/80
          shadow-2xl md:shadow-none
          transition-transform duration-200 ease-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-[120%] md:translate-x-0"}
        `}
        style={{ userSelect: "none" }}
      >
      {/* Logo — click goes to dashboard */}
      <button
        onClick={() => {
          onNavigate("dashboard");
          onCloseMobile?.();
        }}
        className="w-full border-b border-slate-800 px-4 py-4 bg-transparent text-left"
      >
        <div className="flex items-center gap-3">
            <LogoMark size={32} subtle />
          <div>
              <div className="text-[22px] font-black tracking-[-0.03em] text-white leading-none">CaseLens</div>
              <div className="mt-1 text-[9.5px] uppercase tracking-[0.14em] text-teal-300/75">Judicial Intelligence Platform</div>
          </div>
        </div>
      </button>

      {/* Court context */}
      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 rounded-lg border border-teal-500/30 bg-teal-500/10 px-3 py-2">
          <div className="blink h-1.5 w-1.5 rounded-full bg-teal-300 flex-shrink-0" />
          <span className="text-[11px] font-semibold tracking-[0.01em] text-teal-200">Delhi High Court</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: "auto", opacity: 0.5 }}>
            <path d="M3 4L5 6L7 4" stroke="#A5B4FC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 pb-2 overflow-y-auto">
        <div className="px-2 pb-2 pt-3 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          MAIN MENU
        </div>
        {navItems.map(item => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                onCloseMobile?.();
              }}
              className={`group mb-1 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-[12.5px] transition-colors
                ${active
                  ? "border-teal-500/40 bg-teal-500/20 text-white"
                  : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-white/5 hover:text-slate-200"
                }`}
            >
              <span className="flex-shrink-0">{item.icon(active)}</span>
              <span className="flex-1 font-medium tracking-tight">{item.label}</span>
              {item.badge && (
                <span className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-bold ${active ? "bg-white/20 text-white" : "bg-white/10 text-slate-400"}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="px-2 pb-2 pt-4 text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-600">
          SYSTEM
        </div>
        <button
          onClick={() => {
            onNavigate("settings");
            onCloseMobile?.();
          }}
          className={`group mb-1 flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-[12.5px] transition-colors
            ${activeView === "settings"
              ? "border-teal-500/40 bg-teal-500/20 text-white"
              : "border-transparent text-slate-400 hover:border-slate-700 hover:bg-white/5 hover:text-slate-200"
            }`}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, opacity: activeView === "settings" ? 1 : 0.7 }}>
            <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.5 3.5L4.5 4.5M10.5 10.5L11.5 11.5M11.5 3.5L10.5 4.5M4.5 10.5L3.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <span className="font-medium tracking-tight">Settings</span>
        </button>
      </nav>

      {/* User */}
      <div className="border-t border-slate-800 px-3 py-3">
        <div className="flex items-center gap-2 rounded-lg px-2 py-2 cursor-pointer hover:bg-white/5 transition-colors">
          <div className="relative flex-shrink-0">
            <LogoMark size={32} subtle />
            <span className="absolute -bottom-1 -right-1 rounded bg-slate-900/80 px-1 text-[8px] font-bold tracking-[0.04em] text-slate-200">
              {initials || "CL"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="truncate text-xs font-semibold text-slate-100">
              {userName}
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500">{userRole}</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.35 }}>
            <path d="M4.5 3L7.5 6L4.5 9" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <button
          onClick={onLogout}
          className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900/60 px-2 py-1.5 text-xs font-semibold text-slate-300 transition-colors hover:border-rose-400/40 hover:bg-rose-500/10 hover:text-rose-200"
        >
          Sign out
        </button>
      </div>
      </aside>
    </>
  );
}
