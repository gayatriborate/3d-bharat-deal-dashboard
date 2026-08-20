// Deterministic mock-data generator for deals & investors.
// Run with: node scripts/generate-data.mjs
import { writeFileSync } from "fs";

// Simple seeded PRNG so data is stable across regenerations
let seed = 42;
function rand() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}
function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}
function pickN(arr, n) {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(randInt(0, copy.length - 1), 1)[0]);
  }
  return out;
}

const industries = [
  "Fintech", "HealthTech", "EdTech", "AgriTech", "CleanEnergy",
  "E-commerce", "Logistics", "SaaS", "Manufacturing", "Media & Entertainment",
];
const stages = ["Seed", "Series A", "Series B", "Series C", "Growth"];
const cities = [
  "Bengaluru", "Mumbai", "Delhi NCR", "Pune", "Hyderabad",
  "Chennai", "Ahmedabad", "Jaipur", "Kolkata", "Chandigarh",
];
const riskLevels = ["Low", "Medium", "High"];

const namePrefixes = [
  "Nova", "Bharat", "Sahaj", "Uday", "Kisan", "Verve", "Sankalp", "Trust",
  "Loka", "Setu", "Vriksha", "Prakash", "Urban", "Swift", "Dhan", "Aarogya",
  "Vidya", "Krishi", "Meridian", "Anant", "Zenith", "Northlane", "Terra",
  "Pixel", "Orbit", "Sundar", "Nimbus", "Ashva", "Vayu", "Kavach",
];
const nameSuffixes = [
  "Labs", "Technologies", "Fintech", "Health", "Systems", "Networks",
  "Robotics", "Energy", "Foods", "Logistics", "Analytics", "Ventures",
  "Mobility", "Cloud", "Works", "Bio", "Farms", "Commerce", "Media", "Group",
];

const taglineBank = {
  Fintech: "Rebuilding credit access for India's next 500 million users.",
  HealthTech: "Diagnostics-first care, delivered to the last mile.",
  EdTech: "Vernacular-first learning for tier 2 and tier 3 India.",
  AgriTech: "Data-driven yield optimisation for smallholder farmers.",
  CleanEnergy: "Decentralised solar for industrial clusters.",
  "E-commerce": "Quick-commerce for Bharat's non-metro shopper.",
  Logistics: "Middle-mile freight, optimised by machine learning.",
  SaaS: "Compliance automation for regulated enterprises.",
  Manufacturing: "Precision components for the EV supply chain.",
  "Media & Entertainment": "Short-form regional content, built for creators.",
};

function makeFinancials(baseYear, startRevenue) {
  const out = [];
  let revenue = startRevenue;
  for (let i = 0; i < 4; i++) {
    const growth = 1 + (randInt(15, 65) / 100);
    revenue = i === 0 ? revenue : revenue * growth;
    const margin = randInt(-10, 28) / 100;
    out.push({
      year: baseYear + i,
      revenue: Math.round(revenue),
      profit: Math.round(revenue * margin),
      valuation: Math.round(revenue * randInt(4, 12)),
    });
  }
  return out;
}

function makeRoiProjection(baseRoi) {
  const out = [];
  for (let i = 1; i <= 5; i++) {
    const drift = randInt(-3, 5) * i;
    out.push({ year: 2025 + i, projectedRoi: Math.max(2, Math.round(baseRoi + drift * 0.6)) });
  }
  return out;
}

const highlightBank = [
  "Backed by marquee angel investors",
  "Profitable at unit-economics level",
  "3x YoY revenue growth for 2 consecutive years",
  "Patent-pending core technology",
  "Strategic tie-up with a PSU distribution network",
  "Founding team from IIT / IIM background",
  "Zero customer churn in enterprise segment",
  "Government scheme empanelment secured",
  "Expanding to 3 new states this fiscal year",
  "Strong repeat-purchase / retention metrics",
];

function generateDeal(i) {
  const industry = pick(industries);
  const stage = pick(stages);
  const name = `${pick(namePrefixes)}${pick(nameSuffixes)}`;
  const founded = randInt(2015, 2023);
  const risk = pick(riskLevels);
  const roiBase = risk === "Low" ? randInt(8, 16) : risk === "Medium" ? randInt(14, 26) : randInt(22, 45);
  const target = randInt(50, 2000);
  const raised = Math.round(target * (randInt(10, 95) / 100));
  const status = raised / target > 0.9 ? "Closing Soon" : raised === target ? "Closed" : "Open";

  return {
    id: `deal-${String(i).padStart(3, "0")}`,
    companyName: name,
    tagline: taglineBank[industry],
    logoSeed: name,
    industry,
    stage,
    city: pick(cities),
    foundedYear: founded,
    riskLevel: risk,
    roi: roiBase,
    minInvestment: pick([1, 2, 5, 10, 25]),
    targetRaise: target,
    raisedSoFar: raised,
    investorCount: randInt(3, 240),
    equityOffered: randInt(2, 20),
    description: `${name} is a ${stage.toLowerCase()}-stage ${industry.toLowerCase()} company headquartered in ${pick(cities)}, focused on scalable, capital-efficient growth across Bharat's emerging markets.`,
    highlights: pickN(highlightBank, 3),
    financials: makeFinancials(founded + 2, randInt(20, 400)),
    roiProjection: makeRoiProjection(roiBase),
    status,
    createdAt: new Date(2024, randInt(0, 11), randInt(1, 28)).toISOString(),
  };
}

const investorTypes = ["Individual", "HNI", "Family Office", "VC Fund"];
function generateInvestor(i) {
  const first = pick(["Aarav", "Vihaan", "Ishaan", "Kabir", "Ananya", "Diya", "Meera", "Riya", "Kavya", "Rohan", "Sanya", "Aditi", "Neha", "Karan", "Priya"]);
  const last = pick(["Sharma", "Iyer", "Reddy", "Mehta", "Kapoor", "Nair", "Gupta", "Bose", "Rao", "Chatterjee"]);
  const risk = pick(riskLevels);
  const budgetMin = pick([1, 5, 10, 25, 50]);
  return {
    id: `inv-${String(i).padStart(3, "0")}`,
    name: `${first} ${last}`,
    type: pick(investorTypes),
    city: pick(cities),
    riskAppetite: risk,
    preferredIndustries: pickN(industries, randInt(2, 4)),
    budgetMin,
    budgetMax: budgetMin * randInt(4, 20),
    totalInvested: randInt(10, 5000),
    activeDeals: randInt(1, 18),
    joinedAt: new Date(2022 + randInt(0, 2), randInt(0, 11), randInt(1, 28)).toISOString(),
    avatarSeed: `${first}${last}${i}`,
  };
}

const deals = Array.from({ length: 84 }, (_, i) => generateDeal(i + 1));
const investors = Array.from({ length: 16 }, (_, i) => generateInvestor(i + 1));

writeFileSync(new URL("../src/data/deals.json", import.meta.url), JSON.stringify(deals, null, 2));
writeFileSync(new URL("../src/data/investors.json", import.meta.url), JSON.stringify(investors, null, 2));

console.log(`Generated ${deals.length} deals and ${investors.length} investors.`);
