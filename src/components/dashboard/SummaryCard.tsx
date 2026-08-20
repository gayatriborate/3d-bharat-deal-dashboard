import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import clsx from "clsx";
import { Card } from "@/components/ui/primitives";

export function SummaryCard({
  label,
  value,
  delta,
  icon: Icon,
  accent = "gold",
}: {
  label: string;
  value: string;
  delta?: number;
  icon: LucideIcon;
  accent?: "gold" | "emerald" | "azure" | "rose";
}) {
  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">{label}</p>
        <div
          className="h-9 w-9 rounded-[var(--radius-sm)] flex items-center justify-center"
          style={{ background: `var(--${accent}-soft)`, color: `var(--${accent})` }}
        >
          <Icon size={16} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <p
          className="text-2xl font-semibold tabular-nums text-[var(--text-primary)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </p>
        {typeof delta === "number" && (
          <span
            className={clsx(
              "flex items-center gap-0.5 text-xs font-medium mb-1",
              delta >= 0 ? "text-[var(--emerald)]" : "text-[var(--rose)]"
            )}
          >
            {delta >= 0 ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
    </Card>
  );
}
