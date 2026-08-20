"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 pt-2">
      <button
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-40 hover:enabled:bg-[var(--surface-hover)]"
      >
        <ChevronLeft size={14} />
      </button>
      {pages.map((p, i) => (
        <div key={p} className="flex items-center gap-1.5">
          {i > 0 && pages[i - 1] !== p - 1 && <span className="text-[var(--text-muted)] text-xs">&hellip;</span>}
          <button
            onClick={() => onChange(p)}
            className={clsx(
              "h-8 w-8 rounded-[var(--radius-sm)] text-xs font-medium transition-colors",
              p === page
                ? "bg-[var(--gold)] text-[#191307]"
                : "text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] border border-[var(--border)]"
            )}
          >
            {p}
          </button>
        </div>
      ))}
      <button
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="h-8 w-8 flex items-center justify-center rounded-[var(--radius-sm)] border border-[var(--border)] text-[var(--text-secondary)] disabled:opacity-40 hover:enabled:bg-[var(--surface-hover)]"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
