import { Deal, InvestorProfile, RiskLevel } from "@/types/deal";

/**
 * Pure, deterministic scoring function — no side effects, so it's cheap to
 * memoize with useMemo/useCallback in the UI layer.
 *
 * Weights sum to 100:
 *  - Industry match   35
 *  - Risk match        25
 *  - Budget fit        20
 *  - ROI attractiveness 20
 */
const WEIGHTS = {
  industry: 35,
  risk: 25,
  budget: 20,
  roi: 20,
};

const riskOrder: RiskLevel[] = ["Low", "Medium", "High"];

function riskProximityScore(dealRisk: RiskLevel, investorRisk: RiskLevel): number {
  const distance = Math.abs(riskOrder.indexOf(dealRisk) - riskOrder.indexOf(investorRisk));
  if (distance === 0) return 1;
  if (distance === 1) return 0.5;
  return 0.1;
}

function budgetFitScore(deal: Deal, investor: InvestorProfile): number {
  if (deal.minInvestment > investor.budgetMax) return 0;
  if (deal.minInvestment < investor.budgetMin * 0.5) return 0.6; // affordable but under-sized
  return 1;
}

function roiAttractivenessScore(roi: number): number {
  // Normalise ROI against a realistic 5%-45% band seen in the dataset.
  const clamped = Math.min(45, Math.max(5, roi));
  return (clamped - 5) / 40;
}

export interface ScoredDeal {
  deal: Deal;
  score: number;
  breakdown: {
    industry: number;
    risk: number;
    budget: number;
    roi: number;
  };
}

export function scoreDeal(deal: Deal, investor: InvestorProfile): ScoredDeal {
  const industryMatch = investor.preferredIndustries.includes(deal.industry) ? 1 : 0.15;
  const riskMatch = riskProximityScore(deal.riskLevel, investor.riskAppetite);
  const budgetMatch = budgetFitScore(deal, investor);
  const roiMatch = roiAttractivenessScore(deal.roi);

  const breakdown = {
    industry: Math.round(industryMatch * WEIGHTS.industry),
    risk: Math.round(riskMatch * WEIGHTS.risk),
    budget: Math.round(budgetMatch * WEIGHTS.budget),
    roi: Math.round(roiMatch * WEIGHTS.roi),
  };

  const score = breakdown.industry + breakdown.risk + breakdown.budget + breakdown.roi;

  return { deal, score, breakdown };
}

export function rankDealsForInvestor(deals: Deal[], investor: InvestorProfile): ScoredDeal[] {
  return deals
    .map((deal) => scoreDeal(deal, investor))
    .sort((a, b) => b.score - a.score);
}
