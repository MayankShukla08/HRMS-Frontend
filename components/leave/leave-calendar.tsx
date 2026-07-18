"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type CalendarEvent, type Holiday } from "@/lib/mock/leave-data";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaveCalendarProps {
  events: CalendarEvent[];
  holidays: Holiday[];
}

const EVENT_STYLES = {
  approved: { dot: "bg-green-500",  bg: "bg-green-100 dark:bg-green-900/40",  text: "text-green-700 dark:text-green-300",  label: "My Leave"   },
  team:     { dot: "bg-blue-500",   bg: "bg-blue-100 dark:bg-blue-900/40",    text: "text-blue-700 dark:text-blue-300",    label: "Team Leave" },
  holiday:  { dot: "bg-amber-500",  bg: "bg-amber-100 dark:bg-amber-900/40",  text: "text-amber-700 dark:text-amber-300",  label: "Holiday"    },
  weekend:  { dot: "bg-slate-300",  bg: "bg-slate-50 dark:bg-slate-800/60",   text: "text-slate-400",                      label: "Weekend"    },
  pending:  { dot: "bg-orange-400", bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-300", label: "Pending"   },
};

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const grid: (number | null)[] = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(d);
  return grid;
}

export function LeaveCalendar({ events, holidays }: LeaveCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date(2026, 5, 1));
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const grid = buildGrid(year, month);
  const today = new Date();

  // Build lookup: dateString → events[]
  const eventMap = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const existing = eventMap.get(ev.date) ?? [];
    eventMap.set(ev.date, [...existing, ev]);
  }
  const holidayMap = new Map(holidays.map((h) => [h.date, h]));

  function dateKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  const monthLabel = viewDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  // Upcoming events for sidebar
  const upcomingEvents = events
    .filter((ev) => {
      const d = new Date(ev.date);
      return d >= today && d.getMonth() === month && d.getFullYear() === year;
    })
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
              <CalendarDays size={15} className="text-violet-600" />
            </div>
            <CardTitle className="text-base font-semibold">Leave Calendar</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewDate(new Date(year, month - 1, 1))}>
              <ChevronLeft size={15} />
            </Button>
            <span className="text-sm font-semibold min-w-[120px] text-center">{monthLabel}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewDate(new Date(year, month + 1, 1))}>
              <ChevronRight size={15} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-0.5">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-muted-foreground py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-7 gap-0.5">
          {grid.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} className="h-10" />;

            const key = dateKey(day);
            const dayEvents = eventMap.get(key) ?? [];
            const holiday = holidayMap.get(key);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isWeekend = dayEvents.some((e) => e.type === "weekend");
            const primaryEvent = dayEvents.find((e) => e.type !== "weekend") ?? dayEvents[0];
            const cfg = primaryEvent ? EVENT_STYLES[primaryEvent.type] : null;

            return (
              <div
                key={day}
                className="relative h-10 group"
                onMouseEnter={() => setHoveredDay(day)}
                onMouseLeave={() => setHoveredDay(null)}
              >
                <div
                  className={cn(
                    "h-full w-full flex flex-col items-center justify-center rounded-lg text-xs font-medium transition-all cursor-default",
                    cfg ? `${cfg.bg} ${cfg.text}` : isWeekend ? "text-muted-foreground/60" : "hover:bg-muted",
                    isToday && !cfg && "ring-2 ring-blue-500 ring-inset"
                  )}
                >
                  <span>{day}</span>
                  {holiday && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-amber-500" />
                  )}
                  {dayEvents.filter((e) => e.type !== "weekend").length > 1 && (
                    <span className="absolute top-0.5 right-0.5 text-[8px] bg-foreground text-background rounded-full w-3.5 h-3.5 flex items-center justify-center">
                      {dayEvents.filter((e) => e.type !== "weekend").length}
                    </span>
                  )}
                </div>

                {/* Hover tooltip */}
                {hoveredDay === day && (dayEvents.length > 0 || holiday) && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 w-max max-w-[180px] rounded-lg border border-border bg-popover shadow-lg p-2 space-y-1 text-xs pointer-events-none">
                    {holiday && (
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500 shrink-0" />
                        <span className="font-medium">{holiday.name}</span>
                      </div>
                    )}
                    {dayEvents
                      .filter((e) => e.type !== "weekend")
                      .map((e, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className={cn("h-2 w-2 rounded-full shrink-0", EVENT_STYLES[e.type].dot)} />
                          <span>{e.employeeName ? `${e.employeeName} — ` : ""}{e.label}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-1">
          {(Object.entries(EVENT_STYLES) as [keyof typeof EVENT_STYLES, typeof EVENT_STYLES[keyof typeof EVENT_STYLES]][])
            .filter(([k]) => k !== "weekend")
            .map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-full", cfg.dot)} />
                {cfg.label}
              </div>
            ))}
        </div>

        {/* Upcoming */}
        {upcomingEvents.length > 0 && (
          <div className="border-t border-border pt-3 space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Upcoming</p>
            {upcomingEvents.map((ev, i) => {
              const cfg = EVENT_STYLES[ev.type];
              const d = new Date(ev.date + "T00:00:00");
              return (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className={cn("h-2 w-2 rounded-full shrink-0", cfg.dot)} />
                  <span className="text-muted-foreground">
                    {d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </span>
                  <span className="font-medium truncate">{ev.label}</span>
                  {ev.employeeName && ev.employeeName !== "You" && (
                    <span className="text-muted-foreground truncate">— {ev.employeeName}</span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
