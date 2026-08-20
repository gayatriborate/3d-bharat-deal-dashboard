import investorsRaw from "@/data/investors.json";
import dealsRaw from "@/data/deals.json";
import { InvestorProfile, Deal } from "@/types/deal";
import { simulateRequest } from "./api";

const allInvestors = investorsRaw as InvestorProfile[];
const allDeals = dealsRaw as Deal[];

export function fetchInvestors(): Promise<InvestorProfile[]> {
  return simulateRequest(() => allInvestors);
}

export function fetchInvestorById(id: string): Promise<InvestorProfile | null> {
  return simulateRequest(() => allInvestors.find((i) => i.id === id) ?? null);
}

/**
 * Corporate-facing analytics: how a company's raise is performing across
 * the investor base — funding raised, investor count, conversion rate.
 */
export function fetchCorporateAnalytics(): Promise<{
  totalFundingRaised: number;
  investorCount: number;
  conversionRate: number;
  fundingTrend: { month: string; raised: number; target: number }[];
  topDeals: { name: string; raised: number; target: number }[];
}> {
  return simulateRequest(() => {
    const totalFundingRaised = allDeals.reduce((sum, d) => sum + d.raisedSoFar, 0);
    const investorCount = allInvestors.reduce((sum, i) => sum + i.activeDeals, 0);
    const totalTarget = allDeals.reduce((sum, d) => sum + d.targetRaise, 0);
    const conversionRate = Math.round((totalFundingRaised / totalTarget) * 1000) / 10;

    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    let raised = 0;
    let target = 0;
    const fundingTrend = months.map((month, i) => {
      raised += (totalFundingRaised / months.length) * (0.7 + ((i % 4) * 0.15));
      target += totalTarget / months.length;
      return { month, raised: Math.round(raised), target: Math.round(target) };
    });

    const topDeals = [...allDeals]
      .sort((a, b) => b.raisedSoFar - a.raisedSoFar)
      .slice(0, 6)
      .map((d) => ({ name: d.companyName, raised: d.raisedSoFar, target: d.targetRaise }));

    return { totalFundingRaised, investorCount, conversionRate, fundingTrend, topDeals };
  }, { errorRate: 0.05, errorMessage: "Could not load corporate analytics. Please retry." });
}
