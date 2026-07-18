"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type DailyAttendance, type AttendanceStatus } from "@/lib/mock/attendance-data";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceCalendarProps {
  records: DailyAttendance[];
}

const STATUS_CONFIG: Record<
  AttendanceStatus,
  { label: string; dot: string; bg: string; text: string }
> = {
  present:  { label: "Present",   dot: "bg-green-500",  bg: "bg-green-500",  text: "text-white" },
  absent:   { label: "Absent",    dot: "bg-red-500",    bg: "bg-red-500",    text: "text-white" },
  late:     { label: "Late",      dot: "bg-orange-400", bg: "bg-orange-400", text: "text-white" },
  "half-day":{ label: "Half Day", dot: "bg-amber-400",  bg: "bg-amber-400",  text: "text-white" },
  holiday:  { label: "Holiday",   dot: "bg-teal-400",   bg: "bg-teal-400",   text: "text-white" },
  weekend:  { label: "Weekend",   dot: "bg-slate-300",  bg: "bg-slate-100",  text: "text-slate-500" },
  "on-leave":{ label: "On Leave", dot: "bg-violet-400", bg: "bg-violet-400", text: "text-white" },
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendarGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  return grid;
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(2026, 5, 1)); // June 2026

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const grid = buildCalendarGrid(year, month);

  // Build lookup by day number
  const byDay = new Map<number, DailyAttendance>();
  for (const r of records) {
    const d = new Date(r.date);
    if (d.getFullYear() === year && d.getMonth() === month) {
      byDay.set(d.getDate(), r);
    }
  }

  const [selected, setSelected] = useState<DailyAttendance | null>(null);

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
    setSelected(null);
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
    setSelected(null);
  }

  const monthLabel = viewDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Stats for this month view
  const counts = {
    present: [...byDay.values()].filter((r) => r.status === "present").length,
    absent: [...byDay.values()].filter((r) => r.status === "absent").length,
    late: [...byDay.values()].filter((r) => r.status === "late").length,
    leave: [...byDay.values()].filter((r) => r.status === "on-leave").length,
  };

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Attendance Calendar</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <CalendarDays size={15} className="text-blue-600" />
          </div>
        </div>

        {/* Month navigator */}
        <div className="flex items-center justify-between pt-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth} aria-label="Previous month">
            <ChevronLeft size={16} />
          </Button>
          <span className="text-sm font-semibold">{monthLabel}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth} aria-label="Next month">
            <ChevronRight size={16} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Mini stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {(
            [
              { key: "present", label: "Present", color: "text-green-600" },
              { key: "absent",  label: "Absent",  color: "text-red-600"   },
              { key: "late",    label: "Late",    color: "text-orange-500" },
              { key: "leave",   label: "Leave",   color: "text-violet-600" },
            ] as const
          ).map(({ key, label, color }) => (
            <div key={key} className="rounded-lg bg-muted/50 py-2">
              <p className={cn("text-lg font-bold", color)}>{counts[key]}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-1">
          {grid.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />;
            const record = byDay.get(day);
            const status = record?.status;
            const cfg = status ? STATUS_CONFIG[status] : null;
            const isToday =
              day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const isSelected = selected?.date === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

            return (
              <button
                key={day}
                onClick={() => setSelected(record ?? null)}
                className={cn(
                  "relative flex h-9 w-full items-center justify-center rounded-lg text-xs font-medium transition-all",
                  cfg ? `${cfg.bg} ${cfg.text}` : "hover:bg-muted",
                  isToday && !cfg && "ring-2 ring-blue-500",
                  isSelected && "ring-2 ring-offset-1 ring-primary",
                  !record && "text-muted-foreground cursor-default"
                )}
                aria-label={`${day} ${monthLabel}`}
              >
                {day}
                {record?.note && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-white border border-current opacity-80" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3 pt-1">
          {(Object.entries(STATUS_CONFIG) as [AttendanceStatus, typeof STATUS_CONFIG[AttendanceStatus]][])
            .filter(([k]) => k !== "weekend")
            .map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-full", cfg.dot)} />
                {cfg.label}
              </div>
            ))}
        </div>

        {/* Selected day detail */}
        {selected && (
          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-semibold">
                {new Date(selected.date + "T00:00:00").toLocaleDateString("en-IN", {
                  weekday: "short", day: "numeric", month: "short",
                })}
              </span>
              <Badge
                className={cn(
                  "border-0 text-xs",
                  STATUS_CONFIG[selected.status].bg,
                  STATUS_CONFIG[selected.status].text
                )}
              >
                {STATUS_CONFIG[selected.status].label}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <span>In: <strong className="text-foreground">{selected.clockIn ?? "—"}</strong></span>
              <span>Out: <strong className="text-foreground">{selected.clockOut ?? "—"}</strong></span>
              <span>Hours: <strong className="text-foreground">{selected.workingHours}h</strong></span>
              <span>OT: <strong className="text-foreground">{selected.overtimeHours}h</strong></span>
            </div>
            {selected.note && (
              <p className="text-xs text-muted-foreground italic">Note: {selected.note}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
