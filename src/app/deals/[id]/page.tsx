"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, MapPin, Calendar, Users, Percent } from "lucide-react";
import { fetchDealById } from "@/services/dealService";
import { useAsync } from "@/hooks/useAsync";
import { Card, ProgressBar, RiskBadge, StatusBadge, Button, Skeleton } from "@/components/ui/primitives";
import { ErrorState } from "@/components/ui/States";
import { Tabs } from "@/components/ui/Tabs";
import { Accordion } from "@/components/ui/Accordion";
import { FinancialsBarChart, RoiProjectionLineChart } from "@/components/dashboard/Charts";
import { formatLakhs, formatLakhsFull, formatDate } from "@/utils/format";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleInterest } from "@/store/slices/interestsSlice";

export default function DealDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: deal, loading, error, retry } = useAsync(() => fetchDealById(id), [id]);
  const dispatch = useAppDispatch();
  const isInterested = useAppSelector((s) => s.interests.dealIds.includes(id));

  if (error) return <ErrorState message={error} onRetry={retry} />;

  if (loading || !deal) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-72 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <Link
        href="/deals"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)]"
      >
        <ArrowLeft size={15} /> Back to Deal Explorer
      </Link>

      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-medium text-[var(--gold)] uppercase tracking-wide">
                {deal.stage}
              </span>
              <StatusBadge status={deal.status} />
            </div>
            <h1
              className="text-2xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {deal.companyName}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1.5 max-w-lg">{deal.tagline}</p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[var(--text-muted)]">
              <span className="flex items-center gap-1.5">
                <MapPin size={13} /> {deal.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} /> Founded {deal.foundedYear}
              </span>
              <span className="flex items-center gap-1.5">
                <Users size={13} /> {deal.investorCount} investors
              </span>
              <span className="flex items-center gap-1.5">
                <Percent size={13} /> {deal.equityOffered}% equity offered
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant={isInterested ? "primary" : "secondary"}
              onClick={() => dispatch(toggleInterest(deal.id))}
            >
              <Heart size={15} fill={isInterested ? "currentColor" : "none"} />
              {isInterested ? "Saved to Interests" : "Save to My Investments"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-[var(--border-soft)]">
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Projected ROI</p>
            <p className="text-lg font-semibold text-[var(--emerald)]">{deal.roi}%</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Min. investment</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">{formatLakhsFull(deal.minInvestment)}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Risk level</p>
            <RiskBadge level={deal.riskLevel} />
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-1">Target raise</p>
            <p className="text-lg font-semibold text-[var(--text-primary)]">{formatLakhs(deal.targetRaise)}</p>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1.5">
            <span>{formatLakhs(deal.raisedSoFar)} raised</span>
            <span>{Math.round((deal.raisedSoFar / deal.targetRaise) * 100)}% of {formatLakhs(deal.targetRaise)} target</span>
          </div>
          <ProgressBar value={deal.raisedSoFar} max={deal.targetRaise} color="emerald" />
        </div>
      </Card>

      <Card className="p-6">
        <Tabs
          tabs={[
            {
              label: "Overview",
              content: (
                <div className="space-y-5">
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{deal.description}</p>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] mb-2.5">Key highlights</p>
                    <ul className="space-y-2">
                      {deal.highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)] mt-1.5 shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ),
            },
            {
              label: "Financials",
              content: (
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-3">
                    Revenue &amp; profit, last {deal.financials.length} years
                  </p>
                  <FinancialsBarChart data={deal.financials} />
                </div>
              ),
            },
            {
              label: "ROI Projections",
              content: (
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)] mb-3">5-year projected ROI</p>
                  <RoiProjectionLineChart data={deal.roiProjection} />
                </div>
              ),
            },
            {
              label: "Risk Analysis",
              content: (
                <Accordion
                  items={[
                    {
                      title: "Market risk",
                      content: `As a ${deal.riskLevel.toLowerCase()}-risk ${deal.industry.toLowerCase()} company, ${deal.companyName} is exposed to typical sector demand cycles and regulatory shifts common to ${deal.industry.toLowerCase()} businesses operating in ${deal.city}.`,
                    },
                    {
                      title: "Execution risk",
                      content: `At the ${deal.stage} stage, execution risk centres on scaling operations while preserving unit economics — particularly around ${deal.equityOffered}% equity dilution across future funding rounds.`,
                    },
                    {
                      title: "Liquidity risk",
                      content: `Private market investments of this kind are typically illiquid until a future funding round, acquisition, or listing event. Investors should plan for a multi-year holding horizon.`,
                    },
                    {
                      title: "Mitigants",
                      content: deal.highlights.join(". ") + ".",
                    },
                  ]}
                />
              ),
            },
          ]}
        />
      </Card>

      <p className="text-xs text-[var(--text-muted)] text-center">
        Listed on 3D Bharat since {formatDate(deal.createdAt)}
      </p>
    </div>
  );
}
