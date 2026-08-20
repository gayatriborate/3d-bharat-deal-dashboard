import dealsRaw from "@/data/deals.json";
import { Deal, DealFilters } from "@/types/deal";
import { simulateRequest } from "./api";

const allDeals = dealsRaw as Deal[];

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function applyFilters(deals: Deal[], filters: Partial<DealFilters>): Deal[] {
  let result = [...deals];

  if (filters.search && filters.search.trim().length > 0) {
    const q = filters.search.trim().toLowerCase();
    result = result.filter(
      (d) =>
        d.companyName.toLowerCase().includes(q) ||
        d.industry.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q) ||
        d.tagline.toLowerCase().includes(q)
    );
  }

  if (filters.industries && filters.industries.length > 0) {
    result = result.filter((d) => filters.industries!.includes(d.industry));
  }

  if (filters.riskLevels && filters.riskLevels.length > 0) {
    result = result.filter((d) => filters.riskLevels!.includes(d.riskLevel));
  }

  if (typeof filters.minRoi === "number") {
    result = result.filter((d) => d.roi >= filters.minRoi!);
  }
  if (typeof filters.maxRoi === "number") {
    result = result.filter((d) => d.roi <= filters.maxRoi!);
  }

  if (filters.investmentRange) {
    const [min, max] = filters.investmentRange;
    result = result.filter((d) => d.minInvestment >= min && d.minInvestment <= max);
  }

  if (filters.stage && filters.stage !== "All") {
    result = result.filter((d) => d.stage === filters.stage);
  }

  return result;
}

const riskWeight: Record<Deal["riskLevel"], number> = { Low: 1, Medium: 2, High: 3 };

function applySort(deals: Deal[], sortBy?: DealFilters["sortBy"], sortDir: DealFilters["sortDir"] = "desc"): Deal[] {
  if (!sortBy) return deals;
  const dir = sortDir === "asc" ? 1 : -1;
  const sorted = [...deals].sort((a, b) => {
    switch (sortBy) {
      case "roi":
        return (a.roi - b.roi) * dir;
      case "risk":
        return (riskWeight[a.riskLevel] - riskWeight[b.riskLevel]) * dir;
      case "raised":
        return (a.raisedSoFar - b.raisedSoFar) * dir;
      case "newest":
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * dir;
      default:
        return 0;
    }
  });
  return sorted;
}

/**
 * Fetch a paginated, filtered, sorted slice of deals.
 * Mirrors what a real REST endpoint like GET /api/deals?search=&page= would do.
 */
export function fetchDeals(filters: Partial<DealFilters>): Promise<PaginatedResult<Deal>> {
  return simulateRequest(() => {
    const filtered = applyFilters(allDeals, filters);
    const sorted = applySort(filtered, filters.sortBy, filters.sortDir);

    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const start = (page - 1) * pageSize;
    const items = sorted.slice(start, start + pageSize);

    return {
      items,
      total: sorted.length,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(sorted.length / pageSize)),
    };
  });
}

export function fetchDealById(id: string): Promise<Deal | null> {
  return simulateRequest(() => allDeals.find((d) => d.id === id) ?? null);
}

export function fetchAllDealsUnpaged(): Promise<Deal[]> {
  return simulateRequest(() => allDeals);
}

export function fetchDealSummary(): Promise<{
  totalInvestments: number;
  activeDeals: number;
  avgRoi: number;
  riskDistribution: { risk: string; count: number }[];
  industryDistribution: { industry: string; count: number; totalRaised: number }[];
  growthOverTime: { month: string; raised: number }[];
}> {
  return simulateRequest(() => {
    const totalInvestments = allDeals.reduce((sum, d) => sum + d.raisedSoFar, 0);
    const activeDeals = allDeals.filter((d) => d.status !== "Closed").length;
    const avgRoi = Math.round(allDeals.reduce((sum, d) => sum + d.roi, 0) / allDeals.length);

    const riskMap = new Map<string, number>();
    allDeals.forEach((d) => riskMap.set(d.riskLevel, (riskMap.get(d.riskLevel) ?? 0) + 1));
    const riskDistribution = Array.from(riskMap, ([risk, count]) => ({ risk, count }));

    const industryMap = new Map<string, { count: number; totalRaised: number }>();
    allDeals.forEach((d) => {
      const entry = industryMap.get(d.industry) ?? { count: 0, totalRaised: 0 };
      entry.count += 1;
      entry.totalRaised += d.raisedSoFar;
      industryMap.set(d.industry, entry);
    });
    const industryDistribution = Array.from(industryMap, ([industry, v]) => ({ industry, ...v }));

    const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
    let running = totalInvestments * 0.35;
    const growthOverTime = months.map((month, i) => {
      running += (totalInvestments * 0.65) / months.length * (0.6 + Math.sin(i) * 0.4 + 0.6);
      return { month, raised: Math.round(running) };
    });

    return { totalInvestments, activeDeals, avgRoi, riskDistribution, industryDistribution, growthOverTime };
  });
}
