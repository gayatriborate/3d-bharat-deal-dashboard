"use client";

import clsx from "clsx";
import { X } from "lucide-react";
import { DealFilters, Industry, RiskLevel } from "@/types/deal";
import { Button, Card } from "@/components/ui/primitives";

const industries: Industry[] = [
  "Fintech", "HealthTech", "EdTech", "AgriTech", "CleanEnergy",
  "E-commerce", "Logistics", "SaaS", "Manufacturing", "Media & Entertainment",
];
const riskLevels: RiskLevel[] = ["Low", "Medium", "High"];
const stages: (DealFilters["stage"])[] = ["All", "Seed", "Series A", "Series B", "Series C", "Growth"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-[var(--gold)] bg-[var(--gold-soft)] text-[var(--gold)]"
          : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]"
      )}
    >
      {children}
    </button>
  );
}

export function DealFiltersPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: DealFilters;
  onChange: (patch: Partial<DealFilters>) => void;
  onReset: () => void;
}) {
  const toggleIndustry = (industry: Industry) => {
    const set = new Set(filters.industries);
    set.has(industry) ? set.delete(industry) : set.add(industry);
    onChange({ industries: Array.from(set) });
  };

  const toggleRisk = (risk: RiskLevel) => {
    const set = new Set(filters.riskLevels);
    set.has(risk) ? set.delete(risk) : set.add(risk);
    onChange({ riskLevels: Array.from(set) });
  };

  const activeCount =
    filters.industries.length + filters.riskLevels.length + (filters.stage !== "All" ? 1 : 0);

  return (
    <Card className="p-4 space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Filters</p>
        {activeCount > 0 && (
          <button
            onClick={onReset}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--rose)] flex items-center gap-1"
          >
            <X size={12} /> Clear ({activeCount})
          </button>
        )}
      </div>

      <div>
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Stage</p>
        <div className="flex flex-wrap gap-1.5">
          {stages.map((s) => (
            <Chip key={s} active={filters.stage === s} onClick={() => onChange({ stage: s })}>
              {s}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Risk level</p>
        <div className="flex flex-wrap gap-1.5">
          {riskLevels.map((r) => (
            <Chip key={r} active={filters.riskLevels.includes(r)} onClick={() => toggleRisk(r)}>
              {r}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">Industry</p>
        <div className="flex flex-wrap gap-1.5">
          {industries.map((ind) => (
            <Chip key={ind} active={filters.industries.includes(ind)} onClick={() => toggleIndustry(ind)}>
              {ind}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
          Min. ROI: {filters.minRoi}% &ndash; {filters.maxRoi}%
        </p>
        <input
          type="range"
          min={0}
          max={50}
          value={filters.minRoi}
          onChange={(e) => onChange({ minRoi: Number(e.target.value) })}
          className="w-full accent-[var(--gold)]"
        />
      </div>

      <div>
        <p className="text-xs font-medium text-[var(--text-secondary)] mb-2">
          Investment range: up to ₹{filters.investmentRange[1]}L
        </p>
        <input
          type="range"
          min={1}
          max={25}
          value={filters.investmentRange[1]}
          onChange={(e) => onChange({ investmentRange: [filters.investmentRange[0], Number(e.target.value)] })}
          className="w-full accent-[var(--gold)]"
        />
      </div>

      <Button variant="secondary" size="sm" className="w-full" onClick={onReset}>
        Reset all filters
      </Button>
    </Card>
  );
}
