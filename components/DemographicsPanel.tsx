import { DemographicsProfile } from "../lib/domainTypes";
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#1F4B99", "#00B8A9", "#94A3B8", "#F59E0B", "#10B981"];

export default function DemographicsPanel({ demographics }: { demographics: DemographicsProfile }) {
  const chartData = demographics.customerSegments.map((seg, idx) => ({
    name: seg.name,
    value: seg.share ?? Math.max(5, Math.round(100 / demographics.customerSegments.length)),
    color: COLORS[idx % COLORS.length]
  }));

  return (
    <div className="card p-4">
      <div className="text-sm uppercase tracking-wide text-slate-500">Demographics</div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="text-sm font-semibold text-slate-800">Customer segments</div>
          <ul className="mt-2 space-y-1 text-sm text-slate-700">
            {demographics.customerSegments.map((seg) => (
              <li key={seg.name} className="flex items-center justify-between rounded-lg border border-slate-100 px-3 py-2">
                <span>
                  {seg.name} <span className="text-xs text-slate-500">({seg.type})</span>
                </span>
                <span className="text-xs font-semibold text-slate-600">{seg.share ?? "n/a"}%</span>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <div className="text-sm font-semibold text-slate-800">Regions</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {demographics.regions.map((r) => (
                <span key={r.name} className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {r.name} • {r.importance}
                </span>
              ))}
            </div>
          </div>
          {demographics.notes && <p className="mt-3 text-sm text-slate-600">{demographics.notes}</p>}
        </div>
        <div className="flex h-64 flex-col items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={80} paddingAngle={4}>
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
