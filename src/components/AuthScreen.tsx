import { useState } from "react";
import { AuthUser, saveSession } from "../lib/auth";
import { authApi } from "../lib/authApi";
import LogoMark from "./LogoMark";

interface AuthScreenProps {
  onAuthenticated: (user: AuthUser, token: string) => void;
}

type AuthMode = "login" | "signup";

const initialForm = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError(null);
  };

  const passwordStrength = (() => {
    const value = form.password;
    let score = 0;
    if (value.length >= 8) score += 1;
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
    if (/\d/.test(value)) score += 1;
    if (/[^A-Za-z0-9]/.test(value)) score += 1;

    if (score <= 1) return { label: "Weak", color: "#dc2626", width: "25%" };
    if (score === 2) return { label: "Fair", color: "#d97706", width: "50%" };
    if (score === 3) return { label: "Good", color: "#059669", width: "75%" };
    return { label: "Strong", color: "#0d9488", width: "100%" };
  })();

  const submit = async () => {
    setError(null);

    if (!form.email.trim() || !form.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    if (!form.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (mode === "signup") {
      if (!form.fullName.trim()) {
        setError("Full name is required for sign up.");
        return;
      }
      if (form.password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError("Password confirmation does not match.");
        return;
      }
    }

    setLoading(true);
    try {
      const result = mode === "login"
        ? await authApi.login({ email: form.email, password: form.password })
        : await authApi.signup({ fullName: form.fullName, email: form.email, password: form.password });

      const user: AuthUser = result.user;
      const token = result.token;
      saveSession(token, user);
      onAuthenticated(user, token);
    } catch {
      setError("Authentication failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-full items-center justify-center overflow-hidden px-4 py-8 md:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-teal-400/30 blur-3xl" />
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-52 w-52 rounded-full bg-amber-200/40 blur-3xl" />
      </div>

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.14)] md:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden bg-slate-900 p-8 text-white md:block">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(45,212,191,0.22),transparent_45%),radial-gradient(circle_at_90%_80%,rgba(56,189,248,0.16),transparent_45%)]" />
          <div className="relative">
            <div className="mb-8 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 px-3 py-2">
              <LogoMark size={32} subtle />
              <div>
                <div className="text-sm font-extrabold tracking-tight">CaseLens Secure</div>
                <div className="text-[10px] uppercase tracking-[0.12em] text-white/55">Secure Workspace</div>
              </div>
            </div>

            <h1 className="max-w-sm text-3xl font-extrabold leading-tight tracking-tight">
              Professional Judicial Workflow, Backed by Secure Identity.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-white/70">
              Sign in to access AI-ranked dockets, precedent intelligence, and courtroom analytics with secure session access.
            </p>

            <div className="mt-8 grid gap-3">
              {[
                "Protected access and secure app shell",
                "AI intelligence across backlog, reports and analytics",
                "Clean responsive dashboard built for courtroom ops",
              ].map((line) => (
                <div key={line} className="flex items-start gap-2 text-sm text-white/85">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-teal-300" />
                  <span>{line}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">{mode === "login" ? "Welcome back" : "Create account"}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {mode === "login" ? "Use your judicial credentials to continue." : "Register to access the CaseLens workspace."}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button
                onClick={() => switchMode("login")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Login
              </button>
              <button
                onClick={() => switchMode("signup")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                Sign up
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {mode === "signup" && (
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Full name</span>
                <input
                  value={form.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  placeholder="Justice Rajiv Sharma"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800"
                />
              </label>
            )}

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Email</span>
              <input
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
                placeholder="r.sharma@delhihc.nic.in"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => onChange("password", e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-16 text-sm text-slate-800"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              {mode === "signup" && form.password.length > 0 && (
                <div className="mt-2">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Password strength</span>
                    <span className="text-[11px] font-semibold" style={{ color: passwordStrength.color }}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: passwordStrength.width, background: passwordStrength.color }} />
                  </div>
                </div>
              )}
            </label>

            {mode === "signup" && (
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">Confirm password</span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => onChange("confirmPassword", e.target.value)}
                    placeholder="Retype password"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 pr-16 text-sm text-slate-800"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-500 hover:bg-slate-100"
                  >
                    {showConfirmPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </label>
            )}
          </div>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Processing...
              </>
            ) : mode === "login" ? "Sign in to CaseLens" : "Create account and continue"}
          </button>

            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-500">
            Secure authentication is enabled for this workspace.
          </div>
        </section>
      </div>
    </div>
  );
}
