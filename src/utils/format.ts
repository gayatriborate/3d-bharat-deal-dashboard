/**
 * All monetary values in the data layer are stored in INR lakhs.
 * These helpers render them the way an Indian investor actually reads them.
 */

export function formatLakhs(lakhs: number): string {
  if (lakhs >= 100) {
    const crores = lakhs / 100;
    return `₹${trimNumber(crores)} Cr`;
  }
  return `₹${trimNumber(lakhs)} L`;
}

export function formatLakhsFull(lakhs: number): string {
  const rupees = lakhs * 100000;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

function trimNumber(n: number): string {
  return n % 1 === 0 ? n.toFixed(0) : n.toFixed(1);
}

export function formatPercent(n: number): string {
  return `${n > 0 ? "+" : ""}${n}%`;
}

export function formatCompactNumber(n: number): string {
  return new Intl.NumberFormat("en-IN", { notation: "compact" }).format(n);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days < 1) return "Today";
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
