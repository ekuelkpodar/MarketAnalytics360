import { IndicatorSet } from "../lib/domainTypes";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function mockBar(seed: number) {
  return Array.from({ length: 6 }).map((_, idx) => ({
    period: `Q${idx + 1}`,
    value: Math.round(seed + idx * 3 + (idx % 2 === 0 ? 2 : -2))
  }));
}

export default function LaggingIndicatorsPanel({ indicators }: { indicators: IndicatorSet }) {
  return (
    <div className="card p-4">
      <div className="text-sm uppercase tracking-wide text-slate-500">Lagging Indicators</div>
      <div className="grid gap-3 md:grid-cols-3">
        {indicators.laggingIndicators.map((ind, idx) => (
          <div key={ind.name} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <div className="text-sm font-semibold text-slate-800">{ind.name}</div>
            <div className="text-xs text-slate-600">{ind.description}</div>
            <div className="mt-1 text-xs text-slate-500">Why lagging: {ind.rationale}</div>
            <div className="mt-2 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockBar(idx * 4 + 8)}>
                  <XAxis dataKey="period" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00B8A9" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
