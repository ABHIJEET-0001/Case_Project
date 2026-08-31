import { useState } from "react";

export default function Settings() {
  const [aiModel, setAiModel] = useState("enhanced");
  const [autoBail, setAutoBail] = useState(true);
  const [precedentSug, setPrecedentSug] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [alertDays, setAlertDays] = useState("48");
  const [activeSection, setActiveSection] = useState("profile");

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className="flex-shrink-0 relative rounded-full transition-all"
      style={{ width: "36px", height: "20px", background: checked ? "#6366F1" : "#E5E7EB" }}
    >
      <div
        className="absolute top-1 rounded-full transition-all"
        style={{ width: "12px", height: "12px", background: "white", left: checked ? "20px" : "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }}
      />
    </button>
  );

  const sections = [
    { id: "profile", label: "Profile & Court" },
    { id: "ai", label: "AI Preferences" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "integrations", label: "Integrations" },
  ];

  return (
    <div className="page-shell fade-in">
      <div className="page-head">
        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-xs text-slate-500">Manage your CaseLens account, court configuration, and AI preferences</p>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
        {/* Left nav */}
        <div className="flex w-full flex-shrink-0 gap-1 overflow-x-auto border-b border-slate-100 bg-white p-3 md:w-52 md:flex-col md:overflow-visible md:border-r md:border-b-0">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="rounded-xl px-3 py-2 text-left text-xs font-medium transition-colors md:mb-0.5 md:w-full"
              style={{
                background: activeSection === s.id ? "#F3F4F6" : "transparent",
                color: activeSection === s.id ? "#111827" : "#6B7280",
                fontWeight: activeSection === s.id ? "600" : "400",
              }}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="page-content flex-1" style={{ paddingTop: "16px" }}>
          {activeSection === "profile" && (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              {/* Avatar */}
              <div className="surface-elevated rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Profile</h3>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "white" }}>
                    RS
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Justice R. Sharma</div>
                    <div className="text-xs text-gray-400 mt-0.5">Judge, Delhi High Court · ID: DHC-JDG-0042</div>
                  </div>
                  <button className="ml-auto text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: "#6B7280", background: "#F3F4F6", border: "1px solid #E5E7EB" }}>
                    Change Photo
                  </button>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { label: "Full Name", value: "Justice Rajiv Sharma" },
                    { label: "Judge ID", value: "DHC-JDG-0042" },
                    { label: "Email", value: "r.sharma@delhihc.nic.in" },
                    { label: "Phone", value: "+91 98100 XXXXX" },
                  ].map(field => (
                    <div key={field.label}>
                      <label className="text-xs font-medium text-gray-500 block mb-1.5">{field.label}</label>
                      <input
                        defaultValue={field.value}
                        className="w-full px-3 py-2 rounded-xl text-sm text-gray-800 outline-none transition-all"
                        style={{ background: "#F9FAFB", border: "1px solid #E5E7EB" }}
                        onFocus={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#6366F1"}
                        onBlur={e => (e.currentTarget as HTMLInputElement).style.borderColor = "#E5E7EB"}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Court */}
              <div className="surface-elevated rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Court Configuration</h3>
                <div className="grid gap-3">
                  {[
                    { label: "Court", value: "Delhi High Court" },
                    { label: "Bench", value: "Division Bench II" },
                    { label: "Court No.", value: "Court 7" },
                    { label: "Jurisdiction", value: "Civil & Criminal" },
                  ].map(field => (
                    <div key={field.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #F9FAFB" }}>
                      <span className="text-xs text-gray-400">{field.label}</span>
                      <span className="text-xs font-medium text-gray-700">{field.value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">Court configuration is managed by the Registry. Contact <a href="#" className="text-indigo-500">registry@delhihc.nic.in</a> to update.</p>
              </div>
            </div>
          )}

          {activeSection === "ai" && (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              <div className="surface-elevated rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-1">AI Model</h3>
                <p className="text-xs text-gray-400 mb-4">Choose the AI model powering case prioritization and legal analysis.</p>
                <div className="flex flex-col gap-3">
                  {[
                    { id: "standard", name: "Standard", desc: "Legal BERT fine-tuned on Indian courts. Faster, lower cost.", badge: null },
                    { id: "enhanced", name: "Enhanced", desc: "Legal BERT + GPT-4o hybrid. Higher accuracy for complex matters.", badge: "Recommended" },
                    { id: "research", name: "Research Preview", desc: "Multimodal model with document OCR and judgment parsing. Beta.", badge: "Beta" },
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setAiModel(m.id)}
                      className="flex items-start gap-3 p-4 rounded-xl cursor-pointer transition-all"
                      style={{ border: `1.5px solid ${aiModel === m.id ? "#6366F1" : "#E5E7EB"}`, background: aiModel === m.id ? "#FAFAFF" : "white" }}
                    >
                      <div className="w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ borderColor: aiModel === m.id ? "#6366F1" : "#D1D5DB" }}>
                        {aiModel === m.id && <div className="w-2 h-2 rounded-full" style={{ background: "#6366F1" }} />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-gray-800">{m.name}</span>
                          {m.badge && <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ background: m.badge === "Beta" ? "#FEF3C7" : "#F0FDF4", color: m.badge === "Beta" ? "#D97706" : "#16A34A", fontSize: "10px" }}>{m.badge}</span>}
                        </div>
                        <p className="text-xs text-gray-400" style={{ lineHeight: "1.5" }}>{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-elevated rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">AI Features</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Auto-flag bail matters", desc: "Automatically detect and flag cases nearing detention deadlines.", checked: autoBail, toggle: () => setAutoBail(v => !v) },
                    { label: "Precedent suggestions", desc: "Show relevant precedents while viewing case details.", checked: precedentSug, toggle: () => setPrecedentSug(v => !v) },
                  ].map(item => (
                    <div key={item.label} className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{item.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                      </div>
                      <Toggle checked={item.checked} onChange={item.toggle} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              <div className="surface-elevated rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Channels</h3>
                <div className="flex flex-col gap-4">
                  {[
                    { label: "Email notifications", desc: "r.sharma@delhihc.nic.in", checked: emailAlerts, toggle: () => setEmailAlerts(v => !v) },
                    { label: "SMS alerts", desc: "+91 98100 XXXXX", checked: smsAlerts, toggle: () => setSmsAlerts(v => !v) },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-800">{item.label}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                      </div>
                      <Toggle checked={item.checked} onChange={item.toggle} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="surface-elevated rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Alert Thresholds</h3>
                <div className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-medium text-gray-500 block mb-2">Case date reminder (hours before)</label>
                    <div className="flex gap-2">
                      {["12", "24", "48", "72"].map(h => (
                        <button
                          key={h}
                          onClick={() => setAlertDays(h)}
                          className="px-4 py-2 rounded-xl text-xs font-medium transition-all"
                          style={{ background: alertDays === h ? "#1D2330" : "#F3F4F6", color: alertDays === h ? "white" : "#6B7280" }}
                        >
                          {h}h
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="pt-3" style={{ borderTop: "1px solid #F9FAFB" }}>
                    <div className="text-xs font-medium text-gray-500 mb-2">Always notify immediately for</div>
                    <div className="flex flex-col gap-2">
                      {["Habeas corpus matters", "SC-directed deadlines", "Contempt proceedings"].map(item => (
                        <div key={item} className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: "#EEF2FF", border: "1px solid #C7D2FE" }}>
                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                              <path d="M1.5 4L3 5.5L6.5 2" stroke="#6366F1" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                          <span className="text-xs text-gray-600">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "security" && (
            <div className="mx-auto flex max-w-3xl flex-col gap-5">
              <div className="surface-elevated rounded-2xl p-5">
                <h3 className="font-semibold text-gray-900 text-sm mb-4">Authentication</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between py-2.5" style={{ borderBottom: "1px solid #F9FAFB" }}>
                    <div>
                      <div className="text-sm font-medium text-gray-800">Two-factor authentication</div>
                      <div className="text-xs text-gray-400 mt-0.5">Required for all judicial access accounts</div>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#F0FDF4", color: "#16A34A" }}>Enabled</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5">
                    <div>
                      <div className="text-sm font-medium text-gray-800">Last login</div>
                      <div className="text-xs text-gray-400 mt-0.5">29 Aug 2026, 8:02 AM · NIC VPN · Delhi</div>
                    </div>
                    <button className="text-xs font-medium text-indigo-600">View log</button>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl p-4" style={{ background: "#FFFBEB", border: "1px solid #FDE68A" }}>
                <div className="flex items-start gap-3">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                    <path d="M8 1.5L1.5 12.5H14.5L8 1.5Z" stroke="#D97706" strokeWidth="1.3" strokeLinejoin="round"/>
                    <path d="M8 6V9" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round"/>
                    <circle cx="8" cy="11" r="0.7" fill="#D97706"/>
                  </svg>
                  <p className="text-xs text-amber-700" style={{ lineHeight: "1.6" }}>
                    CaseLens accesses NIC judicial databases through end-to-end encrypted channels. All case data is governed by the <strong>Indian Judiciary Data Protection Policy 2024</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "integrations" && (
            <div className="mx-auto flex max-w-3xl flex-col gap-4">
              {[
                { name: "NIC e-Courts", desc: "National Informatics Centre case management integration.", status: "connected", color: "#10B981" },
                { name: "SCI CIS", desc: "Supreme Court of India Case Information System — precedent sync.", status: "connected", color: "#10B981" },
                { name: "eCourt Services API", desc: "High Court case filing and cause list generation.", status: "connected", color: "#10B981" },
                { name: "LIMBS", desc: "Legal Information Management & Briefing System (MoL&J).", status: "pending", color: "#F59E0B" },
                { name: "FASTER", desc: "Supreme Court FASTER system for bail orders.", status: "disconnected", color: "#EF4444" },
              ].map(integration => (
                <div key={integration.name} className="surface-elevated flex items-center gap-4 rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#F3F4F6" }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="2" width="6" height="6" rx="1.5" stroke="#9CA3AF" strokeWidth="1.3"/>
                      <rect x="10" y="2" width="6" height="6" rx="1.5" stroke="#9CA3AF" strokeWidth="1.3"/>
                      <rect x="2" y="10" width="6" height="6" rx="1.5" stroke="#9CA3AF" strokeWidth="1.3"/>
                      <path d="M13 10V13H16" stroke="#9CA3AF" strokeWidth="1.3" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800">{integration.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{integration.desc}</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: integration.color }} />
                    <span className="text-xs capitalize" style={{ color: integration.color }}>{integration.status}</span>
                    {integration.status !== "connected" && (
                      <button className="ml-2 text-xs font-medium px-3 py-1.5 rounded-lg" style={{ color: "#6366F1", background: "#EEF2FF" }}>
                        Connect
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Save button */}
          {["profile", "ai", "notifications"].includes(activeSection) && (
            <div className="mt-6 flex gap-3">
              <button className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: "#1D2330" }}>
                Save Changes
              </button>
              <button className="px-5 py-2.5 rounded-xl text-sm font-medium text-gray-500" style={{ background: "#F3F4F6" }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
