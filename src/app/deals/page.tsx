"use client";

import { useEffect, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loadDeals, setFilters, setPage, resetFilters } from "@/store/slices/dealsSlice";
import { useDebounce } from "@/hooks/useDebounce";
import { DealCard } from "@/components/deals/DealCard";
import { DealFiltersPanel } from "@/components/deals/DealFiltersPanel";
import { Pagination } from "@/components/deals/Pagination";
import { Skeleton } from "@/components/ui/primitives";
import { ErrorState, EmptyState } from "@/components/ui/States";
import { DealFilters } from "@/types/deal";

const sortOptions: { value: DealFilters["sortBy"]; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "roi", label: "Highest ROI" },
  { value: "raised", label: "Most funded" },
  { value: "risk", label: "Risk level" },
];

export default function DealExplorerPage() {
  const dispatch = useAppDispatch();
  const { items, total, totalPages, filters, status, error } = useAppSelector((s) => s.deals);
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 350);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      dispatch(setFilters({ search: debouncedSearch }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(loadDeals(filters));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const patchFilters = (patch: Partial<DealFilters>) => dispatch(setFilters(patch));
  const handleReset = () => {
    setSearchInput("");
    dispatch(resetFilters());
  };

  return (
    <div className="space-y-6 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          Deal Explorer
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Search and filter {total || "..."} live opportunities across every stage and sector.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by company, industry, or city..."
            className="w-full rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] pl-10 pr-9 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--gold)] outline-none"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <select
          value={filters.sortBy}
          onChange={(e) => patchFilters({ sortBy: e.target.value as DealFilters["sortBy"] })}
          className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--gold)]"
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              Sort: {o.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowFilters((v) => !v)}
          className="lg:hidden flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--surface)] px-4 py-2.5 text-sm text-[var(--text-secondary)]"
        >
          <SlidersHorizontal size={15} /> Filters
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        <div className={showFilters ? "block" : "hidden lg:block"}>
          <DealFiltersPanel filters={filters} onChange={patchFilters} onReset={handleReset} />
        </div>

        <div className="space-y-6">
          {error ? (
            <ErrorState message={error} onRetry={() => dispatch(loadDeals(filters))} />
          ) : status === "loading" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-[280px]" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <EmptyState
              title="No deals match those filters"
              description="Try widening your ROI range or clearing an industry filter to see more opportunities."
            />
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
              <Pagination page={filters.page} totalPages={totalPages} onChange={(p) => dispatch(setPage(p))} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
