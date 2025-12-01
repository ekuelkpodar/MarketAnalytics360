import { Industry } from "../lib/domainTypes";

export default function BusinessValueChainPanel({ industry }: { industry: Industry }) {
  return (
    <div className="card p-4">
      <div className="text-sm uppercase tracking-wide text-slate-500">Business & Value Chain</div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        {industry.valueChain.map((stage, idx) => (
          <div
            key={stage.stage}
            className="relative rounded-lg border border-slate-100 bg-slate-50 p-3 shadow-sm"
          >
            <div className="text-sm font-semibold text-slate-800">{stage.stage}</div>
            <div className="mt-1 text-xs text-slate-600">{stage.description}</div>
            <div className="mt-2 inline-flex rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-700">
              Margin: {stage.marginProfile}
            </div>
            {idx < industry.valueChain.length - 1 && (
              <div className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-xs text-slate-500 md:flex">
                →
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <div className="text-sm font-semibold text-slate-800">Common business models</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {industry.businessModels.map((b) => (
            <span key={b} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {b}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
