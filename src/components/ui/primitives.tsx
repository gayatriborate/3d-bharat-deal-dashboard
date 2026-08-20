import { HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { RiskLevel } from "@/types/deal";

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--surface)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-md bg-[var(--surface-hover)]",
        className
      )}
    />
  );
}

const riskStyles: Record<RiskLevel, string> = {
  Low: "text-[var(--emerald)] bg-[var(--emerald-soft)] border-[var(--emerald)]/30",
  Medium: "text-[var(--gold)] bg-[var(--gold-soft)] border-[var(--gold)]/30",
  High: "text-[var(--rose)] bg-[var(--rose-soft)] border-[var(--rose)]/30",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
        riskStyles[level]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level} Risk
    </span>
  );
}

export function StatusBadge({ status }: { status: "Open" | "Closing Soon" | "Closed" }) {
  const styles = {
    Open: "text-[var(--emerald)] bg-[var(--emerald-soft)]",
    "Closing Soon": "text-[var(--gold)] bg-[var(--gold-soft)]",
    Closed: "text-[var(--text-muted)] bg-[var(--surface-hover)]",
  }[status];
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", styles)}>
      {status}
    </span>
  );
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: HTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
}) {
  const variants = {
    primary: "bg-[var(--gold)] text-[#191307] hover:brightness-110",
    secondary:
      "bg-[var(--surface-hover)] text-[var(--text-primary)] border border-[var(--border)] hover:bg-[var(--surface)]",
    ghost: "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)]",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2.5 text-sm" };
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between mb-4">
      <div>
        {eyebrow && (
          <p className="text-xs font-medium tracking-wider uppercase text-[var(--gold)] mb-1">
            {eyebrow}
          </p>
        )}
        <h2
          className="text-lg font-semibold text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({ value, max, color = "gold" }: { value: number; max: number; color?: "gold" | "emerald" }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="h-1.5 w-full rounded-full bg-[var(--surface-hover)] overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{
          width: `${pct}%`,
          background: color === "gold" ? "var(--gold)" : "var(--emerald)",
        }}
      />
    </div>
  );
}
