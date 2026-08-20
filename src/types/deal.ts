export type RiskLevel = "Low" | "Medium" | "High";

export type Industry =
  | "Fintech"
  | "HealthTech"
  | "EdTech"
  | "AgriTech"
  | "CleanEnergy"
  | "E-commerce"
  | "Logistics"
  | "SaaS"
  | "Manufacturing"
  | "Media & Entertainment";

export type DealStage =
  | "Seed"
  | "Series A"
  | "Series B"
  | "Series C"
  | "Growth";

export interface FinancialSnapshot {
  year: number;
  revenue: number; // in INR lakhs
  profit: number; // in INR lakhs
  valuation: number; // in INR lakhs
}

export interface Deal {
  id: string;
  companyName: string;
  tagline: string;
  logoSeed: string;
  industry: Industry;
  stage: DealStage;
  city: string;
  foundedYear: number;
  riskLevel: RiskLevel;
  roi: number; // projected annual ROI %
  minInvestment: number; // in INR lakhs
  targetRaise: number; // in INR lakhs
  raisedSoFar: number; // in INR lakhs
  investorCount: number;
  equityOffered: number; // %
  description: string;
  highlights: string[];
  financials: FinancialSnapshot[];
  roiProjection: { year: number; projectedRoi: number }[];
  status: "Open" | "Closing Soon" | "Closed";
  createdAt: string; // ISO date
}

export interface InvestorProfile {
  id: string;
  name: string;
  type: "Individual" | "HNI" | "Family Office" | "VC Fund";
  city: string;
  riskAppetite: RiskLevel;
  preferredIndustries: Industry[];
  budgetMin: number; // lakhs
  budgetMax: number; // lakhs
  totalInvested: number; // lakhs
  activeDeals: number;
  joinedAt: string;
  avatarSeed: string;
}

export interface DealFilters {
  search: string;
  industries: Industry[];
  riskLevels: RiskLevel[];
  minRoi: number;
  maxRoi: number;
  investmentRange: [number, number];
  stage: DealStage | "All";
  sortBy: "roi" | "risk" | "newest" | "raised" | "matchScore";
  sortDir: "asc" | "desc";
  page: number;
  pageSize: number;
}
