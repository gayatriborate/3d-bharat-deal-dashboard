"use client";

import { useState, ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";

export function Accordion({ items }: { items: { title: string; content: ReactNode }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[var(--border-soft)] border-t border-b border-[var(--border-soft)]">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={item.title}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="w-full flex items-center justify-between py-3.5 text-left"
            >
              <span className="text-sm font-medium text-[var(--text-primary)]">{item.title}</span>
              <ChevronDown
                size={16}
                className={clsx("text-[var(--text-muted)] transition-transform", isOpen && "rotate-180")}
              />
            </button>
            {isOpen && <div className="pb-4 text-sm text-[var(--text-secondary)]">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
