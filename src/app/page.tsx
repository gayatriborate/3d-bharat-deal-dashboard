"use client";

import { useMemo } from "react";
import { Wallet, Activity, TrendingUp, ShieldAlert } from "lucide-react";
import { fetchDealSummary } from "@/services/dealService";
import { useAsync } from "@/hooks/useAsync";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { GrowthAreaChart, IndustryPieChart, RiskRoiScatter } from "@/components/dashboard/Charts";
import { Card, SectionHeading, Skeleton } from "@/components/ui/primitives";
import { ErrorState } from "@/components/ui/States";
import { formatLakhs } from "@/utils/format";
import { RecommendedDeals } from "@/components/dashboard/RecommendedDeals";
import dealsRaw from "@/data/deals.json";
import { Deal } from "@/types/deal";

const allDeals = dealsRaw as Deal[];

export default function OverviewPage() {
  const { data, loading, error, retry } = useAsync(() => fetchDealSummary(), []);

  const riskCounts = useMemo(() => {
    if (!data) return { Low: 0, Medium: 0, High: 0 };
    return data.riskDistribution.reduce(
      (acc, r) => ({ ...acc, [r.risk]: r.count }),
      { Low: 0, Medium: 0, High: 0 } as Record<string, number>
    );
  }, [data]);

  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1
          className="text-2xl font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Investor Overview
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          A snapshot of deal flow, portfolio risk, and where capital is moving across Bharat.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading || !data ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-[124px]" />)
        ) : (
          <>
            <SummaryCard
              label="Total Investments"
              value={formatLakhs(data.totalInvestments)}
              delta={12.4}
              icon={Wallet}
              accent="gold"
            />
            <SummaryCard
              label="Active Deals"
              value={String(data.activeDeals)}
              delta={4.1}
              icon={Activity}
              accent="azure"
            />
            <SummaryCard
              label="Avg. Projected ROI"
              value={`${data.avgRoi}%`}
              delta={2.3}
              icon={TrendingUp}
              accent="emerald"
            />
            <SummaryCard
              label="High-Risk Exposure"
              value={`${riskCounts.High} deals`}
              delta={-1.8}
              icon={ShieldAlert}
              accent="rose"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <SectionHeading eyebrow="Trend" title="Investment growth over time" />
          {loading || !data ? <Skeleton className="h-[260px]" /> : <GrowthAreaChart data={data.growthOverTime} />}
        </Card>
        <Card className="p-5">
          <SectionHeading eyebrow="Mix" title="Industry distribution" />
          {loading || !data ? (
            <Skeleton className="h-[260px]" />
          ) : (
            <IndustryPieChart data={data.industryDistribution} />
          )}
        </Card>
      </div>

      <Card className="p-5">
        <SectionHeading eyebrow="Trade-off" title="Risk vs. ROI across all live deals" />
        <RiskRoiScatter data={allDeals} />
      </Card>

      <RecommendedDeals />
    </div>
  );
}
