"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { type DailyAttendance, type WeeklyTrend } from "@/lib/mock/attendance-data";
import { BarChart2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceAnalyticsProps {
  calendar: DailyAttendance[];
  weeklyTrend: WeeklyTrend[];
}

type View = "daily" | "weekly";

// ─── Bar chart helpers ─────────────────────────────────────────────────────────

function BarChart({
  data,
  maxValue,
  barColor,
  targetLine,
  formatLabel,
}: {
  data: { label: string; value: number; accent?: string }[];
  maxValue: number;
  barColor: string;
  targetLine?: number;
  formatLabel?: (v: number) => string;
}) {
  const fmt = formatLabel ?? ((v: number) => `${v}`);
  const targetPct = targetLine ? (targetLine / maxValue) * 100 : null;

  return (
    <div className="relative">
      {/* Target line */}
      {targetPct !== null && (
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-blue-400/60 z-10"
          style={{ bottom: `${targetPct}%`, top: "auto" }}
        >
          <span className="absolute -top-4 right-0 text-[10px] text-blue-500 font-medium">
            Target {fmt(targetLine!)}
          </span>
        </div>
      )}

      {/* Bars */}
      <div className="flex items-end gap-1.5 h-36 pt-6">
        {data.map((d, i) => {
          const pct = maxValue > 0 ? (d.value / maxValue) * 100 : 0;
          return (
            <div key={i} className="group flex flex-1 flex-col items-center gap-1">
              {/* Tooltip */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-semibold text-foreground bg-card border border-border rounded px-1.5 py-0.5 shadow-sm whitespace-nowrap z-20">
                {fmt(d.value)}
              </div>
              <div className="w-full flex-1 flex items-end">
                <div
                  className={cn("w-full rounded-t-md transition-all duration-500", d.accent ?? barColor)}
                  style={{ height: `${Math.max(pct, 2)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X labels */}
      <div className="flex items-start gap-1.5 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground truncate">
            {d.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Donut chart for status distribution ──────────────────────────────────────

function DonutChart({
  segments,
}: {
  segments: { label: string; value: number; color: string; textColor: string }[];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  if (total === 0) return null;

  const size = 120;
  const cx = size / 2;
  const cy = size / 2;
  const R = 46;
  const r = 28;
  const gap = 1.5; // degrees gap between slices

  let cumAngle = -90;
  const slices = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const angle = (s.value / total) * (360 - gap * segments.filter((x) => x.value > 0).length);
      const start = cumAngle;
      const end = cumAngle + angle;
      cumAngle = end + gap;

      function polarToXY(deg: number, radius: number) {
        const rad = (deg * Math.PI) / 180;
        return {
          x: cx + radius * Math.cos(rad),
          y: cy + radius * Math.sin(rad),
        };
      }

      const s1 = polarToXY(start, R);
      const e1 = polarToXY(end, R);
      const s2 = polarToXY(end, r);
      const e2 = polarToXY(start, r);
      const large = angle > 180 ? 1 : 0;

      return {
        ...s,
        path: `M ${s1.x} ${s1.y} A ${R} ${R} 0 ${large} 1 ${e1.x} ${e1.y} L ${s2.x} ${s2.y} A ${r} ${r} 0 ${large} 0 ${e2.x} ${e2.y} Z`,
      };
    });

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} className="hover:opacity-80 transition-opacity" />
        ))}
        {/* Center label */}
        <text x={cx} y={cy - 4} textAnchor="middle" className="fill-foreground" fontSize="14" fontWeight="700">
          {total}
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" className="fill-muted-foreground" fontSize="8">
          days
        </text>
      </svg>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
        {segments
          .filter((s) => s.value > 0)
          .map((s, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-muted-foreground">{s.label}</span>
              <span className="font-semibold text-foreground ml-auto">{s.value}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function AttendanceAnalytics({ calendar, weeklyTrend }: AttendanceAnalyticsProps) {
  const [view, setView] = useState<View>("daily");

  // Daily working-hours bar data (last 14 working days)
  const dailyData = calendar
    .filter((d) => ["present", "late", "half-day"].includes(d.status) && d.workingHours > 0)
    .slice(-14)
    .map((d) => {
      const day = new Date(d.date + "T00:00:00").toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
      return {
        label: day,
        value: d.workingHours,
        accent:
          d.status === "late"
            ? "bg-orange-400"
            : d.workingHours >= 9
            ? "bg-blue-500"
            : "bg-blue-400",
      };
    });

  // Weekly hours bar data
  const weeklyData = weeklyTrend.map((w) => ({
    label: w.week,
    value: w.hours,
    accent: w.hours >= w.target ? "bg-blue-500" : "bg-amber-400",
  }));

  // Status distribution for donut
  const statusCounts = {
    present: calendar.filter((d) => d.status === "present").length,
    late: calendar.filter((d) => d.status === "late").length,
    absent: calendar.filter((d) => d.status === "absent").length,
    "half-day": calendar.filter((d) => d.status === "half-day").length,
    "on-leave": calendar.filter((d) => d.status === "on-leave").length,
  };

  const donutSegments = [
    { label: "Present",  value: statusCounts.present,    color: "#22c55e", textColor: "text-green-600" },
    { label: "Late",     value: statusCounts.late,        color: "#fb923c", textColor: "text-orange-500" },
    { label: "Half Day", value: statusCounts["half-day"], color: "#fbbf24", textColor: "text-amber-500" },
    { label: "On Leave", value: statusCounts["on-leave"], color: "#a78bfa", textColor: "text-violet-500" },
    { label: "Absent",   value: statusCounts.absent,      color: "#f87171", textColor: "text-red-500" },
  ];

  const barData = view === "daily" ? dailyData : weeklyData;
  const maxVal = Math.max(...barData.map((d) => d.value), 1);
  const targetLine = view === "weekly" ? 40 : 8;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <BarChart2 size={15} className="text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Attendance Analytics</CardTitle>
              <CardDescription>Working hours & distribution</CardDescription>
            </div>
          </div>

          {/* View toggle */}
          <div className="flex rounded-lg border border-border bg-muted/50 p-0.5 self-start sm:self-auto">
            {(["daily", "weekly"] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all",
                  view === v
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-3">
          {/* Bar chart — takes 2 cols */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {view === "daily" ? "Daily Working Hours (last 14 days)" : "Weekly Total Hours"}
              </p>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <TrendingUp size={12} />
                <span>Target: {targetLine}h</span>
              </div>
            </div>
            <BarChart
              data={barData}
              maxValue={Math.ceil(maxVal / 2) * 2}
              barColor="bg-blue-500"
              targetLine={targetLine}
              formatLabel={(v) => `${v}h`}
            />

            {/* Bar color legend */}
            <div className="flex gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-sm bg-blue-500 inline-block" />
                On time / full day
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-4 rounded-sm bg-orange-400 inline-block" />
                Late
              </span>
              {view === "weekly" && (
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-4 rounded-sm bg-amber-400 inline-block" />
                  Below target
                </span>
              )}
            </div>
          </div>

          {/* Donut chart */}
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Status Distribution
            </p>
            <DonutChart segments={donutSegments} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
