interface SidebarProps {
  activeView: string;
  onNavigate: (view: string) => void;
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

export default function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside
      style={{
        width: "220px",
        minWidth: "220px",
        height: "100%",
        background: "#0B0D14",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.045)",
        userSelect: "none",
      }}
    >
      {/* Logo — click goes to dashboard */}
      <button
        onClick={() => onNavigate("dashboard")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "18px 16px 16px",
          background: "none",
          border: "none",
          borderBottom: "1px solid rgba(255,255,255,0.045)",
          cursor: "pointer",
          textAlign: "left",
          width: "100%",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="5.5" cy="5.5" r="3.5" stroke="white" strokeWidth="1.5" />
            <path d="M8.5 8.5L12 12" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5.5 3.5V7.5M3.5 5.5H7.5" stroke="white" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "white", letterSpacing: "-0.2px", lineHeight: 1 }}>CaseLens</div>
          <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", marginTop: "2px", letterSpacing: "0.02em" }}>AI Legal Platform</div>
        </div>
      </button>

      {/* Court context */}
      <div style={{ padding: "10px 12px 8px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            padding: "7px 10px",
            borderRadius: "8px",
            background: "rgba(79,70,229,0.1)",
            border: "1px solid rgba(79,70,229,0.2)",
          }}
        >
          <div className="blink" style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#818CF8", flexShrink: 0 }} />
          <span style={{ fontSize: "11px", color: "#A5B4FC", fontWeight: 500, letterSpacing: "0.01em" }}>Delhi High Court</span>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: "auto", opacity: 0.4 }}>
            <path d="M3 4L5 6L7 4" stroke="#A5B4FC" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "4px 8px", overflowY: "auto" }}>
        <div style={{ fontSize: "9.5px", fontWeight: 600, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 8px 6px" }}>
          MAIN MENU
        </div>
        {navItems.map(item => {
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                background: active ? "rgba(79,70,229,0.18)" : "none",
                border: active ? "1px solid rgba(79,70,229,0.25)" : "1px solid transparent",
                color: active ? "white" : "rgba(255,255,255,0.42)",
                fontSize: "12.5px",
                fontWeight: active ? 600 : 400,
                letterSpacing: "-0.1px",
                marginBottom: "1px",
                textAlign: "left",
                cursor: "pointer",
                transition: "all 0.12s ease",
              }}
              onMouseEnter={e => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
                }
              }}
              onMouseLeave={e => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background = "none";
                  (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.42)";
                }
              }}
            >
              <span style={{ flexShrink: 0 }}>{item.icon(active)}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 700,
                    padding: "1px 5px",
                    borderRadius: "100px",
                    background: active ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.07)",
                    color: active ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div style={{ fontSize: "9.5px", fontWeight: 600, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em", textTransform: "uppercase", padding: "16px 8px 6px" }}>
          SYSTEM
        </div>
        <button
          onClick={() => onNavigate("settings")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            width: "100%",
            padding: "8px 10px",
            borderRadius: "8px",
            background: activeView === "settings" ? "rgba(79,70,229,0.18)" : "none",
            border: activeView === "settings" ? "1px solid rgba(79,70,229,0.25)" : "1px solid transparent",
            color: activeView === "settings" ? "white" : "rgba(255,255,255,0.42)",
            fontSize: "12.5px",
            fontWeight: activeView === "settings" ? 600 : 400,
            textAlign: "left",
            cursor: "pointer",
            transition: "all 0.12s ease",
          }}
          onMouseEnter={e => {
            if (activeView !== "settings") {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.7)";
            }
          }}
          onMouseLeave={e => {
            if (activeView !== "settings") {
              (e.currentTarget as HTMLButtonElement).style.background = "none";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.42)";
            }
          }}
        >
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" style={{ flexShrink: 0, opacity: activeView === "settings" ? 1 : 0.6 }}>
            <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M7.5 1.5V3M7.5 12V13.5M1.5 7.5H3M12 7.5H13.5M3.5 3.5L4.5 4.5M10.5 10.5L11.5 11.5M11.5 3.5L10.5 4.5M4.5 10.5L3.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          Settings
        </button>
      </nav>

      {/* User */}
      <div style={{ padding: "10px 12px 14px", borderTop: "1px solid rgba(255,255,255,0.045)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            padding: "8px 10px",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background 0.12s",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)"}
          onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 700,
              color: "white",
              flexShrink: 0,
              letterSpacing: "0.04em",
            }}
          >
            RS
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              Justice R. Sharma
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.28)", marginTop: "1px" }}>Division Bench II</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, opacity: 0.3 }}>
            <path d="M4.5 3L7.5 6L4.5 9" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </aside>
  );
}
