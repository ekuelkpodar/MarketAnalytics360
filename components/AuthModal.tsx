import { useEffect, useState } from "react";
import classNames from "classnames";

interface Props {
  open: boolean;
  mode: "signin" | "signup";
  onClose: () => void;
  onAuthed: (user: { name: string; email: string }) => void;
}

export default function AuthModal({ open, mode, onClose, onAuthed }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setError(null);
      setPassword("");
      if (mode === "signin") setName("");
    }
  }, [open, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill all required fields.");
      return;
    }

    // Local-only demo auth; in production, replace with backend.
    const user = { name: name || "Analyst", email };
    try {
      localStorage.setItem("ma360_user", JSON.stringify(user));
      onAuthed(user);
      onClose();
    } catch {
      setError("Unable to save session locally.");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/70 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              {mode === "signup" ? "Create account" : "Welcome back"}
            </div>
            <div className="text-xl font-semibold text-slate-900">
              {mode === "signup" ? "Sign up for MarketAnalytics360" : "Sign in to MarketAnalytics360"}
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="block text-sm font-medium text-slate-700">
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                placeholder="Alex Analyst"
              />
            </label>
          )}
          <label className="block text-sm font-medium text-slate-700">
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="you@company.com"
            />
          </label>
          <label className="block text-sm font-medium text-slate-700">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
              placeholder="••••••••"
            />
          </label>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            type="submit"
            className={classNames(
              "w-full rounded-lg px-4 py-2 text-sm font-semibold text-white",
              mode === "signup" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-slate-900 hover:bg-slate-800"
            )}
          >
            {mode === "signup" ? "Create account" : "Sign in"}
          </button>
          <div className="text-xs text-slate-500">
            Demo-only auth. Replace with your identity provider when ready.
          </div>
        </form>
      </div>
    </div>
  );
}
