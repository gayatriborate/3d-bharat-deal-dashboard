"use client";

import Link from "next/link";
import { Heart, MapPin } from "lucide-react";
import clsx from "clsx";
import { Deal } from "@/types/deal";
import { Card, ProgressBar, RiskBadge, StatusBadge } from "@/components/ui/primitives";
import { formatLakhs } from "@/utils/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleInterest } from "@/store/slices/interestsSlice";

export function DealCard({ deal }: { deal: Deal }) {
  const dispatch = useAppDispatch();
  const isInterested = useAppSelector((s) => s.interests.dealIds.includes(deal.id));

  return (
    <Card className="p-4 flex flex-col gap-3.5 hover:border-[var(--gold)]/40 transition-colors group relative">
      <button
        onClick={(e) => {
          e.preventDefault();
          dispatch(toggleInterest(deal.id));
        }}
        aria-label={isInterested ? "Remove from my investments" : "Save to my investments"}
        className={clsx(
          "absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center transition-colors z-10",
          isInterested
            ? "bg-[var(--rose-soft)] text-[var(--rose)]"
            : "bg-[var(--surface-hover)] text-[var(--text-muted)] hover:text-[var(--rose)]"
        )}
      >
        <Heart size={14} fill={isInterested ? "currentColor" : "none"} />
      </button>

      <Link href={`/deals/${deal.id}`} className="flex flex-col gap-3.5">
        <div className="pr-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-medium text-[var(--gold)] uppercase tracking-wide">
              {deal.stage}
            </span>
            <StatusBadge status={deal.status} />
          </div>
          <p className="font-semibold text-[var(--text-primary)] group-hover:text-[var(--gold)] transition-colors">
            {deal.companyName}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-1">{deal.tagline}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {deal.city}
          </span>
          <span>&middot;</span>
          <span>{deal.industry}</span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="text-[var(--text-muted)] mb-0.5">Projected ROI</p>
            <p className="font-semibold text-[var(--emerald)]">{deal.roi}%</p>
          </div>
          <div>
            <p className="text-[var(--text-muted)] mb-0.5">Min. ticket</p>
            <p className="font-semibold text-[var(--text-primary)]">{formatLakhs(deal.minInvestment)}</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-1.5">
            <span>{formatLakhs(deal.raisedSoFar)} raised</span>
            <span>of {formatLakhs(deal.targetRaise)}</span>
          </div>
          <ProgressBar value={deal.raisedSoFar} max={deal.targetRaise} color="emerald" />
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[var(--border-soft)]">
          <RiskBadge level={deal.riskLevel} />
          <span className="text-[11px] text-[var(--text-muted)]">{deal.investorCount} investors</span>
        </div>
      </Link>
    </Card>
  );
}
