"use client";

import { Building2, Users, TrendingUp } from "lucide-react";
import { fetchCorporateAnalytics } from "@/services/investorService";
import { useAsync } from "@/hooks/useAsync";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { FundingTrendChart, TopDealsBarChart } from "@/components/dashboard/Charts";
import { Card, SectionHeading, Skeleton } from "@/components/ui/primitives";
import { ErrorState } from "@/components/ui/States";
import { formatLakhs } from "@/utils/format";

export default function CorporateDashboardPage() {
  const { data, loading, error, retry } = useAsync(() => fetchCorporateAnalytics(), []);

  if (error) return <ErrorState message={error} onRetry={retry} />;

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
          Corporate Analytics
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Fundraising performance and investor engagement across all listed companies.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading || !data ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-[124px]" />)
        ) : (
          <>
            <SummaryCard
              label="Total Funding Raised"
              value={formatLakhs(data.totalFundingRaised)}
              delta={9.6}
              icon={Building2}
              accent="gold"
            />
            <SummaryCard
              label="Active Investor Positions"
              value={String(data.investorCount)}
              delta={5.2}
              icon={Users}
              accent="azure"
            />
            <SummaryCard
              label="Conversion Rate"
              value={`${data.conversionRate}%`}
              delta={1.4}
              icon={TrendingUp}
              accent="emerald"
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <Card className="xl:col-span-2 p-5">
          <SectionHeading eyebrow="Trend" title="Funding raised vs. target, by month" />
          {loading || !data ? <Skeleton className="h-[260px]" /> : <FundingTrendChart data={data.fundingTrend} />}
        </Card>
        <Card className="p-5">
          <SectionHeading eyebrow="Leaderboard" title="Top funded companies" />
          {loading || !data ? <Skeleton className="h-[280px]" /> : <TopDealsBarChart data={data.topDeals} />}
        </Card>
      </div>
    </div>
  );
}
