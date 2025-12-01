import { Industry } from "../lib/domainTypes";
import Pill from "./common/Pill";

export default function OverviewPanel({ industry }: { industry: Industry }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm uppercase tracking-wide text-slate-500">Overview</div>
          <div className="text-xl font-semibold text-slate-900">{industry.name}</div>
        </div>
        <Pill text={industry.category} />
      </div>
      <p className="mt-3 text-sm text-slate-700">{industry.description}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="text-sm font-semibold text-slate-800">Business models</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {industry.businessModels.map((b) => (
              <Pill key={b} text={b} />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="text-sm font-semibold text-slate-800">Revenue drivers</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            {industry.revenueDrivers.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="text-sm font-semibold text-slate-800">Cost drivers</div>
          <ul className="mt-2 list-disc pl-5 text-sm text-slate-700">
            {industry.costDrivers.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
          <div className="text-sm font-semibold text-slate-800">Segments</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {industry.segments.map((s) => (
              <Pill key={s} text={s} />
            ))}
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="text-sm font-semibold text-slate-800">Value chain</div>
        <div className="mt-3 grid gap-3 md:grid-cols-5">
          {industry.valueChain.map((stage) => (
            <div key={stage.stage} className="rounded-lg border border-slate-100 bg-white p-3 shadow-sm">
              <div className="text-sm font-semibold text-slate-800">{stage.stage}</div>
              <div className="mt-1 text-xs text-slate-600">{stage.description}</div>
              <div className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700">
                Margin: {stage.marginProfile}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
