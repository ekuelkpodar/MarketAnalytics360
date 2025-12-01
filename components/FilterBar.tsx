import { Scenario, TimeHorizon, Region } from "../lib/domainTypes";

interface Props {
  region: Region;
  timeHorizon: TimeHorizon;
  scenario: Scenario;
  onRegionChange: (r: Region) => void;
  onTimeChange: (t: TimeHorizon) => void;
  onScenarioChange: (s: Scenario) => void;
}

const regions: Region[] = [
  "Global",
  "North America",
  "Europe",
  "Asia-Pacific",
  "Latin America",
  "Africa"
];

const horizons: TimeHorizon[] = ["Short-term", "Medium-term", "Long-term"];
const scenarios: Scenario[] = ["Baseline", "Optimistic", "Pessimistic"];

export default function FilterBar({
  region,
  timeHorizon,
  scenario,
  onRegionChange,
  onTimeChange,
  onScenarioChange
}: Props) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white/80 p-4 backdrop-blur">
      <div className="text-lg font-semibold text-slate-800">Market 360° Dashboard</div>
      <div className="flex flex-wrap gap-3">
        <Select label="Region" value={region} options={regions} onChange={(v) => onRegionChange(v as Region)} />
        <Select
          label="Horizon"
          value={timeHorizon}
          options={horizons}
          onChange={(v) => onTimeChange(v as TimeHorizon)}
        />
        <Select label="Scenario" value={scenario} options={scenarios} onChange={(v) => onScenarioChange(v as Scenario)} />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  options,
  onChange
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-sm text-slate-700">
      <span className="mr-2 font-medium">{label}</span>
      <select
        className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}
