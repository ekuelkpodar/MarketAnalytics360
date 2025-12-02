import { useEffect, useState } from "react";
import classNames from "classnames";

interface Command {
  id: string;
  label: string;
  action: () => void;
}

export default function CommandPalette({ commands }: { commands: Command[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands: \"open macro\", \"run agents\", \"compare industries\""
            className="w-full bg-transparent text-sm text-slate-900 outline-none"
          />
          <span className="text-xs text-slate-500">Esc</span>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filtered.length === 0 && <div className="px-4 py-3 text-sm text-slate-500">No commands found.</div>}
          {filtered.map((cmd) => (
            <button
              key={cmd.id}
              onClick={() => {
                cmd.action();
                setOpen(false);
              }}
              className={classNames(
                "flex w-full items-center justify-between px-4 py-3 text-left text-sm",
                "hover:bg-emerald-50"
              )}
            >
              <span className="text-slate-900">{cmd.label}</span>
              <span className="text-xs text-slate-500">Enter</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
