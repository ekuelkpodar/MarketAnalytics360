import { useMemo } from "react";
import classNames from "classnames";
import { Industry } from "../lib/domainTypes";

interface Props {
  industries: Industry[];
  selectedId: string;
  onSelect: (id: string) => void;
  filterText?: string;
  onFilterChange?: (text: string) => void;
}

export default function IndustrySidebar({
  industries,
  selectedId,
  onSelect,
  filterText,
  onFilterChange
}: Props) {
  const filtered = useMemo(() => {
    const text = (filterText ?? "").toLowerCase();
    if (!text) return industries;
    return industries.filter((i) => i.name.toLowerCase().includes(text));
  }, [filterText, industries]);

  return (
    <aside className="w-72 shrink-0 border-r border-slate-200 bg-white">
      <div className="p-4">
        <input
          type="text"
          value={filterText}
          onChange={(e) => onFilterChange?.(e.target.value)}
          placeholder="Search industries..."
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>
      <div className="max-h-[calc(100vh-6rem)] overflow-y-auto px-2 pb-6">
        {filtered.map((industry) => (
          <button
            key={industry.id}
            onClick={() => onSelect(industry.id)}
            className={classNames(
              "mb-1 w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100",
              {
                "bg-primary/10 text-primary": industry.id === selectedId
              }
            )}
          >
            <div className="font-semibold">{industry.name}</div>
            <div className="text-xs text-slate-500">{industry.category}</div>
          </button>
        ))}
      </div>
    </aside>
  );
}
