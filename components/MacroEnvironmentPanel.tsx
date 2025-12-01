import { MacroEnvironment } from "../lib/domainTypes";
import RiskRadar from "./common/RiskRadar";

export default function MacroEnvironmentPanel({ macro }: { macro: MacroEnvironment }) {
  const entries: { label: string; items: string[] }[] = [
    { label: "Political/Regulatory", items: macro.political },
    { label: "Economic", items: macro.economic },
    { label: "Social", items: macro.social },
    { label: "Technological", items: macro.technological },
    { label: "Environmental", items: macro.environmental },
    { label: "Legal", items: macro.legal }
  ];

  return (
    <div className="card p-4">
      <div className="text-sm uppercase tracking-wide text-slate-500">Macro & Policy Environment</div>
      <div className="mt-3 grid gap-3 md:grid-cols-3">
        {entries.map((entry) => (
          <div key={entry.label} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="text-sm font-semibold text-slate-800">{entry.label}</div>
            <ul className="mt-2 list-disc pl-4 text-xs text-slate-700">
              {entry.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-800">Macro risk radar</div>
        <RiskRadar risks={macro.macroRisks} />
      </div>
    </div>
  );
}
