"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import dealsRaw from "@/data/deals.json";
import { Deal } from "@/types/deal";
import { useAppSelector } from "@/store/hooks";
import { rankDealsForInvestor } from "@/utils/scoring";
import { Card, RiskBadge, SectionHeading, Skeleton } from "@/components/ui/primitives";
import { formatLakhs } from "@/utils/format";

const allDeals = dealsRaw as Deal[];

export function RecommendedDeals() {
  const { list, activeInvestorId, status } = useAppSelector((s) => s.investors);
  const activeInvestor = list.find((i) => i.id === activeInvestorId);

  // Memoized: only recompute the ranking when the investor persona or the
  // (static) deal set changes, per the "avoid unnecessary work" requirement.
  const ranked = useMemo(() => {
    if (!activeInvestor) return [];
    return rankDealsForInvestor(allDeals, activeInvestor).slice(0, 4);
  }, [activeInvestor]);

  return (
    <Card className="p-5">
      <SectionHeading
        eyebrow="Recommendation engine"
        title={activeInvestor ? `Matched for ${activeInvestor.name}` : "Matched deals"}
        action={
          <Link
            href="/deals"
            className="text-xs font-medium text-[var(--gold)] flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            Explore all deals <ArrowRight size={13} />
          </Link>
        }
      />
      {status === "loading" || !activeInvestor ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[150px]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {ranked.map(({ deal, score }) => (
            <Link
              key={deal.id}
              href={`/deals/${deal.id}`}
              className="group rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--bg-elevated)] p-4 hover:border-[var(--gold)]/50 transition-colors flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-sm text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors">
                    {deal.companyName}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">{deal.industry}</p>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-[var(--gold)] bg-[var(--gold-soft)] rounded-full px-2 py-1 shrink-0">
                  <Sparkles size={11} />
                  {score}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <RiskBadge level={deal.riskLevel} />
                <span className="text-[var(--emerald)] font-medium">{deal.roi}% ROI</span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Min. ticket {formatLakhs(deal.minInvestment)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </Card>
  );
}
