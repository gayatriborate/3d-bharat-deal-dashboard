"use client";

import { useState, ReactNode } from "react";
import clsx from "clsx";

export function Tabs({
  tabs,
}: {
  tabs: { label: string; content: ReactNode }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div role="tablist" className="flex items-center gap-1 border-b border-[var(--border)] mb-5 overflow-x-auto">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={clsx(
              "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors",
              active === i
                ? "border-[var(--gold)] text-[var(--text-primary)]"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{tabs[active].content}</div>
    </div>
  );
}
