"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";
import dealsRaw from "@/data/deals.json";
import { Deal } from "@/types/deal";
import { formatLakhs, formatPercent } from "@/utils/format";

const deals = dealsRaw as Deal[];

interface TickerItem {
  id: string;
  name: string;
  roi: number;
  delta: number;
  raised: number;
}

function buildTickerItems(): TickerItem[] {
  // Sample a rotating slice so the strip feels alive without real-time data.
  return [...deals]
    .sort((a, b) => b.investorCount - a.investorCount)
    .slice(0, 18)
    .map((d) => ({
      id: d.id,
      name: d.companyName,
      roi: d.roi,
      delta: Math.round((Math.sin(d.roi + d.investorCount) * 4.5) * 10) / 10,
      raised: d.raisedSoFar,
    }));
}

export function Ticker() {
  // Data is static/deterministic (derived from the bundled JSON), so a lazy
  // initializer is enough — no effect or client/server mismatch risk.
  const [items] = useState<TickerItem[]>(() => buildTickerItems());

  if (items.length === 0) return <div className="h-11 border-b border-[var(--border)] bg-[var(--bg-elevated)]" />;

  const loop = [...items, ...items];

  return (
    <div className="relative overflow-hidden border-b border-[var(--border)] bg-[var(--bg-elevated)] h-11 flex items-center">
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[var(--bg-elevated)] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[var(--bg-elevated)] to-transparent z-10 pointer-events-none" />
      <div className="ticker-track flex items-center gap-8 whitespace-nowrap px-4 font-mono text-xs" style={{ fontFamily: "var(--font-mono)" }}>
        {loop.map((item, i) => (
          <div key={`${item.id}-${i}`} className="flex items-center gap-2 shrink-0">
            <span className="font-medium text-[var(--text-primary)]">{item.name}</span>
            <span className="text-[var(--text-muted)]">{formatLakhs(item.raised)}</span>
            <span
              className={clsx(
                "flex items-center gap-0.5 font-medium",
                item.delta >= 0 ? "text-[var(--emerald)]" : "text-[var(--rose)]"
              )}
            >
              {item.delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {formatPercent(item.delta)}
            </span>
            <span className="text-[var(--text-muted)]">ROI {item.roi}%</span>
            <span className="text-[var(--border)]">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
