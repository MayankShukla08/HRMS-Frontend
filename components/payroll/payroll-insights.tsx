"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type SalaryTrendPoint, type MonthlySalaryRecord, mockYTDSummary } from "@/lib/mock/payroll-data";
import { BarChart2, TrendingUp, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";

interface PayrollInsightsProps {
  trend: SalaryTrendPoint[];
  history: MonthlySalaryRecord[];
}

type ChartView = "trend" | "comparison";

function fmt(n: number) {
  if (n >= 100_000) return `₹${(n / 100_000).toFixed(1)}L`;
  if (n >= 1_000) return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

function fmtFull(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}

// ─── SVG Area Chart ────────────────────────────────────────────────────────────

function AreaChart({
  data,
  color,
  fillColor,
  width = 600,
  height = 120,
}: {
  data: number[];
  color: string;
  fillColor: string;
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = 8;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const step = w / (data.length - 1);

  const points = data.map((v, i) => ({
    x: pad + i * step,
    y: pad + h - ((v - min) / range) * h,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`area-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillColor} stopOpacity="0.35" />
          <stop offset="100%" stopColor={fillColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#area-${color})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={color} className="opacity-0 hover:opacity-100 transition-opacity" />
      ))}
    </svg>
  );
}

// ─── Grouped Bar Chart ─────────────────────────────────────────────────────────

function GroupedBarChart({
  data,
  width = 600,
  height = 140,
}: {
  data: { label: string; gross: number; deductions: number; net: number }[];
  width?: number;
  height?: number;
}) {
  const max = Math.max(...data.flatMap((d) => [d.gross, d.net]));
  const pad = { top: 8, bottom: 24, left: 4, right: 4 };
  const chartH = height - pad.top - pad.bottom;
  const groupW = (width - pad.left - pad.right) / data.length;
  const barW = Math.max((groupW - 6) / 2, 4);
  const gap = 2;

  const [hovered, setHovered] = useState<{ i: number; type: "gross" | "net" } | null>(null);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        style={{ height }}
        preserveAspectRatio="xMidYMax meet"
      >
        {data.map((d, i) => {
          const cx = pad.left + i * groupW + groupW / 2;
          const grossH = (d.gross / max) * chartH;
          const netH   = (d.net / max) * chartH;
          const grossX = cx - barW - gap / 2;
          const netX   = cx + gap / 2;

          return (
            <g key={d.label}>
              {/* Gross bar */}
              <rect
                x={grossX} y={pad.top + chartH - grossH}
                width={barW} height={grossH}
                rx="2"
                fill={hovered?.i === i && hovered.type === "gross" ? "#2563eb" : "#3b82f6"}
                className="transition-colors cursor-pointer"
                onMouseEnter={() => setHovered({ i, type: "gross" })}
                onMouseLeave={() => setHovered(null)}
              />
              {/* Net bar */}
              <rect
                x={netX} y={pad.top + chartH - netH}
                width={barW} height={netH}
                rx="2"
                fill={hovered?.i === i && hovered.type === "net" ? "#16a34a" : "#22c55e"}
                className="transition-colors cursor-pointer"
                onMouseEnter={() => setHovered({ i, type: "net" })}
                onMouseLeave={() => setHovered(null)}
              />
              {/* Month label */}
              <text
                x={cx} y={height - 4}
                textAnchor="middle"
                fontSize="8"
                fill="currentColor"
                className="fill-muted-foreground"
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover tooltip */}
      {hovered !== null && (() => {
        const d = data[hovered.i];
        const val = hovered.type === "gross" ? d.gross : d.net;
        return (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 rounded-lg border border-border bg-popover shadow-lg px-2.5 py-1.5 text-xs pointer-events-none z-10">
            <p className="font-semibold">{d.label} — {hovered.type === "gross" ? "Gross" : "Net"}</p>
            <p className="text-muted-foreground">{fmtFull(val)}</p>
          </div>
        );
      })()}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function PayrollInsights({ trend, history }: PayrollInsightsProps) {
  const [view, setView] = useState<ChartView>("trend");

  const ytd = mockYTDSummary;

  const barData = trend.map((t) => ({
    label: t.month,
    gross: t.gross,
    deductions: t.deductions,
    net: t.net,
  }));

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
              <BarChart2 size={15} className="text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Payroll Insights</CardTitle>
              <CardDescription>12-month salary analytics</CardDescription>
            </div>
          </div>

          {/* Toggle */}
          <div className="flex rounded-lg border border-border bg-muted/40 p-0.5 self-start sm:self-auto">
            {(["trend", "comparison"] as ChartView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all capitalize",
                  view === v
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v === "trend" ? "Net Trend" : "Gross vs Net"}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* YTD summary tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "YTD Gross",      val: ytd.grossEarned,   color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-900/20"   },
            { label: "YTD Net",        val: ytd.netReceived,   color: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20" },
            { label: "YTD Deductions", val: ytd.totalDeducted, color: "text-red-600",    bg: "bg-red-50 dark:bg-red-900/20"     },
            { label: "YTD Tax Paid",   val: ytd.taxPaid,       color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-900/20" },
          ].map(({ label, val, color, bg }) => (
            <div key={label} className={cn("rounded-xl p-3 space-y-0.5", bg)}>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className={cn("text-base font-bold tabular-nums", color)}>{fmt(val)}</p>
            </div>
          ))}
        </div>

        {/* Chart area */}
        {view === "trend" ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="uppercase tracking-wide font-medium">Net Salary Trend</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-3 rounded-sm bg-green-500 inline-block" />
                Net Take-Home
              </div>
            </div>
            <div className="h-32">
              <AreaChart
                data={trend.map((t) => t.net)}
                color="#22c55e"
                fillColor="#22c55e"
              />
            </div>
            {/* X labels */}
            <div className="flex justify-between text-[9px] text-muted-foreground px-1">
              {trend.map((t) => (
                <span key={t.month} className="flex-1 text-center truncate">{t.month}</span>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="uppercase tracking-wide font-medium">Gross vs Net — Last 6 Months</span>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-blue-500 inline-block" /> Gross</span>
                <span className="flex items-center gap-1"><span className="h-2 w-3 rounded-sm bg-green-500 inline-block" /> Net</span>
              </div>
            </div>
            <GroupedBarChart data={barData.slice(-6)} />
          </div>
        )}

        {/* Monthly range sparkline hint */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border">
          <span>
            Range: <strong className="text-foreground">{fmt(Math.min(...trend.map(t => t.net)))}</strong>
            {" – "}
            <strong className="text-foreground">{fmt(Math.max(...trend.map(t => t.net)))}</strong>
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp size={12} className="text-green-600" />
            Avg net: <strong className="text-foreground ml-1">{fmt(Math.round(trend.reduce((s, t) => s + t.net, 0) / trend.length))}</strong>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
