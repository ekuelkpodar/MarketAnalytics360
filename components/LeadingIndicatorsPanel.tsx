import { IndicatorSet } from "../lib/domainTypes";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function mockSeries(seed: number) {
  return Array.from({ length: 8 }).map((_, idx) => ({
    period: `T${idx + 1}`,
    value: Math.round(seed + Math.sin(idx) * 5 + idx * 2)
  }));
}

export default function LeadingIndicatorsPanel({ indicators }: { indicators: IndicatorSet }) {
  const grouped = indicators.leadingIndicators.reduce<Record<string, typeof indicators.leadingIndicators>>(
    (acc, ind) => {
      acc[ind.category] = acc[ind.category] ?? [];
      acc[ind.category].push(ind);
      return acc;
    },
    {}
  );

  return (
    <div className="card p-4">
      <div className="text-sm uppercase tracking-wide text-slate-500">Leading Indicators</div>
      <div className="grid gap-3 md:grid-cols-2">
        {Object.entries(grouped).map(([category, inds]) => (
          <div key={category} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="text-sm font-semibold text-slate-800">{category}</div>
            <div className="mt-2 space-y-3">
              {inds.map((ind, idx) => (
                <div key={ind.name} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
                  <div className="text-sm font-semibold text-slate-800">{ind.name}</div>
                  <div className="text-xs text-slate-600">{ind.description}</div>
                  <div className="mt-1 text-xs text-slate-500">Why leading: {ind.rationale}</div>
                  <div className="mt-2 h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockSeries(idx * 5 + 10)}>
                        <XAxis dataKey="period" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#1F4B99" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
