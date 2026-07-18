"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type TodayStatus } from "@/lib/mock/attendance-data";
import {
  Clock,
  LogIn,
  LogOut,
  MapPin,
  CheckCircle2,
  Timer,
  Sunset,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ClockWidgetProps {
  todayStatus: TodayStatus;
}

function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

export function ClockWidget({ todayStatus }: ClockWidgetProps) {
  const [now, setNow] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(todayStatus.isClockedIn);
  const [clockInTime, setClockInTime] = useState<string | null>(todayStatus.clockIn);
  const [clockOutTime, setClockOutTime] = useState<string | null>(todayStatus.clockOut);
  const [elapsedHours, setElapsedHours] = useState(todayStatus.workingHours);
  const [events, setEvents] = useState(todayStatus.events);

  // Live clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Accumulate elapsed time when clocked in
  useEffect(() => {
    if (!isClockedIn) return;
    const id = setInterval(() => {
      setElapsedHours((prev) => prev + 1 / 3600);
    }, 1000);
    return () => clearInterval(id);
  }, [isClockedIn]);

  const handleClockIn = useCallback(() => {
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setIsClockedIn(true);
    setClockInTime(timeStr);
    setElapsedHours(0);
    setEvents((prev) => [
      ...prev,
      { type: "in" as const, time: `${timeStr}`, location: "Office – Main Gate" },
    ]);
  }, [now]);

  const handleClockOut = useCallback(() => {
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setIsClockedIn(false);
    setClockOutTime(timeStr);
    setEvents((prev) => [
      ...prev,
      { type: "out" as const, time: `${timeStr}`, location: "Office – Main Gate" },
    ]);
  }, [now]);

  const timeStr = now.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const shiftPct = (() => {
    if (!clockInTime) return 0;
    const [sh, sm] = todayStatus.shiftStart.split(":").map(Number);
    const [eh, em] = todayStatus.shiftEnd.split(":").map(Number);
    const totalShift = (eh * 60 + em) - (sh * 60 + sm);
    const worked = Math.min(elapsedHours * 60, totalShift);
    return Math.round((worked / totalShift) * 100);
  })();

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Clock In / Out</CardTitle>
          <Badge
            className={cn(
              "border-0 text-xs",
              isClockedIn
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                : "bg-muted text-muted-foreground"
            )}
          >
            {isClockedIn ? "● Active" : "○ Inactive"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Live clock */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white text-center">
          <p className="text-4xl font-bold font-mono tracking-widest">{timeStr}</p>
          <p className="text-blue-200 text-sm mt-1">{dateStr}</p>

          {/* Shift info */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-blue-200">
            <span className="flex items-center gap-1">
              <Sunset size={12} />
              Shift: {todayStatus.shiftStart} – {todayStatus.shiftEnd}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Shift progress</span>
            <span className="font-semibold text-foreground">{shiftPct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-1000"
              style={{ width: `${shiftPct}%` }}
            />
          </div>
        </div>

        {/* Clock in / out summary */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground mb-1">Clock In</p>
            <p className="text-sm font-bold text-green-600">
              {clockInTime ?? "—"}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground mb-1">Duration</p>
            <p className="text-sm font-bold">
              {clockInTime ? formatDuration(elapsedHours) : "—"}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground mb-1">Clock Out</p>
            <p className="text-sm font-bold text-red-500">
              {clockOutTime ?? "—"}
            </p>
          </div>
        </div>

        {/* Action button */}
        {isClockedIn ? (
          <Button
            onClick={handleClockOut}
            variant="outline"
            className="w-full gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 dark:border-red-900 dark:hover:bg-red-900/20"
            size="lg"
          >
            <LogOut size={16} />
            Clock Out
          </Button>
        ) : (
          <Button
            onClick={handleClockIn}
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
            disabled={!!clockOutTime}
          >
            <LogIn size={16} />
            {clockOutTime ? "Already Completed" : "Clock In"}
          </Button>
        )}

        {/* Event log */}
        {events.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Today's Log
            </p>
            <div className="space-y-2">
              {events.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 text-sm">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                      ev.type === "in"
                        ? "bg-green-100 dark:bg-green-900/20"
                        : "bg-red-100 dark:bg-red-900/20"
                    )}
                  >
                    {ev.type === "in" ? (
                      <CheckCircle2 size={14} className="text-green-600" />
                    ) : (
                      <Timer size={14} className="text-red-500" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-medium">
                      {ev.type === "in" ? "Clocked In" : "Clocked Out"}
                    </span>
                    <span className="text-muted-foreground"> · {ev.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                    <MapPin size={11} />
                    <span className="hidden sm:block">{ev.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
