import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CaseSearch from "./components/CaseSearch";
import CaseBacklog from "./components/CaseBacklog";
import CaseDetail from "./components/CaseDetail";
import Analytics from "./components/Analytics";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import AuthScreen from "./components/AuthScreen";
import LogoMark from "./components/LogoMark";
import { AuthUser, clearSession, isTokenValid, loadSession, refreshDemoJwt, saveSession } from "./lib/auth";

type View = "dashboard" | "search" | "backlog" | "analytics" | "reports" | "settings" | "detail";

export default function App() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [caseData, setCaseData] = useState<Record<string, unknown> | null>(null);
  const [previousView, setPreviousView] = useState<View>("backlog");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [jwtToken, setJwtToken] = useState<string | null>(null);

  useEffect(() => {
    const session = loadSession();
    if (session) {
      setAuthUser(session.user);
      setJwtToken(session.token);
    }
  }, []);

  const handleNavigate = (view: string, data?: unknown) => {
    if (view === "detail" && data) {
      setPreviousView(activeView === "detail" ? previousView : activeView as View);
      setCaseData(data as Record<string, unknown>);
    }
    setActiveView(view as View);
    setMobileMenuOpen(false);
  };

  const handleBack = () => {
    setActiveView(previousView);
    setCaseData(null);
  };

  // Cmd+K → open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        handleNavigate("search");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const sidebarActive = activeView === "detail" ? previousView : activeView;

  const handleAuthenticated = (user: AuthUser, token: string) => {
    setAuthUser(user);
    setJwtToken(token);
  };

  const handleLogout = () => {
    clearSession();
    setAuthUser(null);
    setJwtToken(null);
    setActiveView("dashboard");
    setCaseData(null);
    setPreviousView("backlog");
  };

  useEffect(() => {
    if (!authUser || !jwtToken) return;

    const tick = () => {
      if (!isTokenValid(jwtToken)) {
        handleLogout();
        return;
      }

      const refreshed = refreshDemoJwt(jwtToken, authUser);
      if (refreshed && refreshed !== jwtToken) {
        saveSession(refreshed, authUser);
        setJwtToken(refreshed);
      }
    };

    tick();
    const id = window.setInterval(tick, 60 * 1000);
    return () => window.clearInterval(id);
  }, [authUser, jwtToken]);

  if (!authUser || !jwtToken) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="app-shell">
      <div className="absolute inset-0 pointer-events-none opacity-70" style={{ background: "linear-gradient(120deg, rgba(15,118,110,0.06), transparent 35%, rgba(217,119,6,0.05) 100%)" }} />
      <div className="relative flex h-full overflow-hidden p-2 md:p-3">
        <Sidebar
          activeView={sidebarActive}
          onNavigate={handleNavigate}
          isMobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
          userName={authUser.fullName}
          userRole={authUser.role}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-hidden min-w-0 surface-elevated bg-white/90 backdrop-blur-sm">
          <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white/90">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="h-9 w-9 rounded-lg border border-slate-200 bg-white text-slate-700 flex items-center justify-center"
              aria-label="Open navigation menu"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4H14M2 8H14M2 12H14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <LogoMark size={24} subtle />
              <div className="text-sm font-semibold tracking-tight text-slate-800">CaseLens Console</div>
            </div>
            <span className="chip">Live Docket</span>
          </div>

          <div key={activeView} className="h-[calc(100%-57px)] md:h-full">
            {activeView === "dashboard" && <Dashboard onNavigate={handleNavigate} userName={authUser.fullName} />}
            {activeView === "search" && <CaseSearch />}
            {activeView === "backlog" && <CaseBacklog onNavigate={handleNavigate} />}
            {activeView === "analytics" && <Analytics />}
            {activeView === "reports" && <Reports />}
            {activeView === "settings" && <Settings />}
            {activeView === "detail" && caseData && (
              <CaseDetail caseData={caseData} onBack={handleBack} onNavigate={handleNavigate} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
