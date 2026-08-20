"use client";

import { useMemo } from "react";
import { Heart, Trash2 } from "lucide-react";
import dealsRaw from "@/data/deals.json";
import { Deal } from "@/types/deal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearInterests } from "@/store/slices/interestsSlice";
import { DealCard } from "@/components/deals/DealCard";
import { EmptyState } from "@/components/ui/States";
import { Button, Card } from "@/components/ui/primitives";
import { formatLakhs } from "@/utils/format";

const allDeals = dealsRaw as Deal[];

export default function MyInvestmentsPage() {
  const dispatch = useAppDispatch();
  const dealIds = useAppSelector((s) => s.interests.dealIds);

  const savedDeals = useMemo(
    () => allDeals.filter((d) => dealIds.includes(d.id)),
    [dealIds]
  );

  const totalMinCommitment = useMemo(
    () => savedDeals.reduce((sum, d) => sum + d.minInvestment, 0),
    [savedDeals]
  );

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            My Investments
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Deals you&apos;ve saved for review, kept locally on this device.
          </p>
        </div>
        {savedDeals.length > 0 && (
          <Button variant="secondary" size="sm" onClick={() => dispatch(clearInterests())}>
            <Trash2 size={14} /> Clear all
          </Button>
        )}
      </div>

      {savedDeals.length > 0 && (
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[var(--gold-soft)] text-[var(--gold)] flex items-center justify-center shrink-0">
            <Heart size={17} fill="currentColor" />
          </div>
          <div>
            <p className="text-sm text-[var(--text-primary)] font-medium">
              {savedDeals.length} deal{savedDeals.length !== 1 ? "s" : ""} saved
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Combined minimum commitment: {formatLakhs(totalMinCommitment)}
            </p>
          </div>
        </Card>
      )}

      {savedDeals.length === 0 ? (
        <EmptyState
          title="No saved deals yet"
          description="Tap the heart icon on any deal in the Explorer to track it here. Everything is saved locally to your browser."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {savedDeals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </div>
      )}
    </div>
  );
}
