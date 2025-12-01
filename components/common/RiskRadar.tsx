interface Risk {
  name: string;
  severity: number; // 1-10
  notes?: string;
}

export default function RiskRadar({ risks }: { risks: Risk[] }) {
  return (
    <div className="mt-2 space-y-2">
      {risks.map((risk) => (
        <div key={risk.name} className="flex items-center gap-3 rounded-lg border border-slate-100 bg-white p-2">
          <div className="min-w-[120px] text-sm font-medium text-slate-800">{risk.name}</div>
          <div className="flex-1">
            <div className="h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${Math.min(10, Math.max(1, risk.severity)) * 10}%` }}
              />
            </div>
          </div>
          <div className="w-12 text-right text-xs font-semibold text-slate-700">{risk.severity}/10</div>
        </div>
      ))}
    </div>
  );
}
