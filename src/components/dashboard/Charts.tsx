"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import { formatLakhs } from "@/utils/format";

const CHART_COLORS = ["#d4a54a", "#24b47e", "#4a90d4", "#e2574c", "#9b7ede", "#4ac0c9", "#e29a4a", "#7ea64a"];

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
}
interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 shadow-xl text-xs">
      {label && <p className="text-[var(--text-muted)] mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-[var(--text-primary)] font-medium">
          {p.name}: {typeof p.value === "number" && p.value > 100 ? formatLakhs(p.value) : p.value}
        </p>
      ))}
    </div>
  );
}

export function GrowthAreaChart({ data }: { data: { month: string; raised: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="growthFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
        <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatLakhs(v)}
          width={70}
        />
        <Tooltip content={<ChartTooltip />} />
        <Area
          type="monotone"
          dataKey="raised"
          name="Cumulative raised"
          stroke="var(--gold)"
          strokeWidth={2}
          fill="url(#growthFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function IndustryPieChart({ data }: { data: { industry: string; count: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="industry"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={2}
          strokeWidth={0}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function RiskRoiScatter({
  data,
}: {
  data: { riskLevel: string; roi: number; raisedSoFar: number; companyName: string }[];
}) {
  const riskToX: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
  const points = data.map((d) => ({ ...d, x: riskToX[d.riskLevel], y: d.roi }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" />
        <XAxis
          type="number"
          dataKey="x"
          domain={[0.5, 3.5]}
          ticks={[1, 2, 3]}
          tickFormatter={(v: number) => ({ 1: "Low", 2: "Medium", 3: "High" } as Record<number, string>)[v] ?? ""}
          stroke="var(--text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="ROI"
          unit="%"
          stroke="var(--text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const p = payload[0].payload;
            return (
              <div className="rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 shadow-xl text-xs">
                <p className="text-[var(--text-primary)] font-medium">{p.companyName}</p>
                <p className="text-[var(--text-muted)]">Risk: {p.riskLevel} &middot; ROI: {p.roi}%</p>
              </div>
            );
          }}
        />
        <Scatter data={points} fill="var(--azure)" fillOpacity={0.75} />
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export function FinancialsBarChart({
  data,
}: {
  data: { year: number; revenue: number; profit: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
        <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatLakhs(v)}
          width={65}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }} />
        <Bar dataKey="revenue" name="Revenue" fill="var(--gold)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="profit" name="Profit" fill="var(--emerald)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function RoiProjectionLineChart({ data }: { data: { year: number; projectedRoi: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
        <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          unit="%"
          width={40}
        />
        <Tooltip content={<ChartTooltip />} />
        <Line
          type="monotone"
          dataKey="projectedRoi"
          name="Projected ROI"
          stroke="var(--azure)"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "var(--azure)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function FundingTrendChart({
  data,
}: {
  data: { month: string; raised: number; target: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="raisedFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--emerald)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--emerald)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" vertical={false} />
        <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
        <YAxis
          stroke="var(--text-muted)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          tickFormatter={(v) => formatLakhs(v)}
          width={70}
        />
        <Tooltip content={<ChartTooltip />} />
        <Legend wrapperStyle={{ fontSize: 11, color: "var(--text-secondary)" }} />
        <Area type="monotone" dataKey="target" name="Target" stroke="var(--text-muted)" strokeDasharray="4 3" fill="transparent" />
        <Area type="monotone" dataKey="raised" name="Raised" stroke="var(--emerald)" strokeWidth={2} fill="url(#raisedFill)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function TopDealsBarChart({ data }: { data: { name: string; raised: number; target: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-soft)" horizontal={false} />
        <XAxis type="number" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => formatLakhs(v)} />
        <YAxis type="category" dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} width={90} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="raised" name="Raised" fill="var(--gold)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
