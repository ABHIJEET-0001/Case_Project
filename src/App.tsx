import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import CaseSearch from "./components/CaseSearch";
import CaseBacklog from "./components/CaseBacklog";
import CaseDetail from "./components/CaseDetail";
import Analytics from "./components/Analytics";
import Reports from "./components/Reports";
import Settings from "./components/Settings";

type View = "dashboard" | "search" | "backlog" | "analytics" | "reports" | "settings" | "detail";

export default function App() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [caseData, setCaseData] = useState<Record<string, unknown> | null>(null);
  const [previousView, setPreviousView] = useState<View>("backlog");

  const handleNavigate = (view: string, data?: unknown) => {
    if (view === "detail" && data) {
      setPreviousView(activeView === "detail" ? previousView : activeView as View);
      setCaseData(data as Record<string, unknown>);
    }
    setActiveView(view as View);
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

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F8F9FB" }}
    >
      <Sidebar activeView={sidebarActive} onNavigate={handleNavigate} />

      <main className="flex-1 overflow-hidden min-w-0">
        <div key={activeView} className="h-full">
          {activeView === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
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
  );
}
