"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeaveBalanceCards }    from "@/components/leave/leave-balance-cards";
import { LeaveAnalyticsCard }   from "@/components/leave/leave-analytics-card";
import { LeaveCalendar }        from "@/components/leave/leave-calendar";
import { LeaveHistoryTable }    from "@/components/leave/leave-history-table";
import { PendingApprovalsCard } from "@/components/leave/pending-approvals-card";
import { ApplyLeaveForm }       from "@/components/leave/apply-leave-form";
import {
  mockLeaveBalances,
  mockMyLeaveRequests,
  mockPendingApprovals,
  mockCalendarEvents,
  mockLeaveAnalytics,
  mockHolidays,
  mockCurrentRole,
  type UserRole,
} from "@/lib/mock/leave-data";
import {
  CalendarPlus,
  Download,
  CalendarDays,
  BookOpen,
  Users,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES: UserRole[] = ["Employee", "Manager", "HR"];

const ROLE_COLORS: Record<UserRole, string> = {
  Employee: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Manager:  "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  HR:       "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

const QUICK_ACTIONS = [
  {
    label: "Download Leave Report",
    icon: Download,
    description: "Export CSV / PDF",
    color: "text-teal-600 bg-teal-50 dark:bg-teal-900/20 hover:bg-teal-100 dark:hover:bg-teal-900/30",
  },
  {
    label: "View Team Calendar",
    icon: Users,
    description: "See who's away",
    color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20 hover:bg-violet-100 dark:hover:bg-violet-900/30",
  },
  {
    label: "Leave Policy",
    icon: BookOpen,
    description: "Read guidelines",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30",
  },
];

export default function LeavePage() {
  const [applyOpen, setApplyOpen] = useState(false);
  const [role, setRole] = useState<UserRole>(mockCurrentRole);

  const showApprovals = role === "Manager" || role === "HR";

  return (
    <>
      <ApplyLeaveForm open={applyOpen} onOpenChange={setApplyOpen} />

      <div className="space-y-6 max-w-[1400px] mx-auto">

        {/* ── Page header ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 justify-between">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">Leave Management</h1>
              <Badge className="border-0 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">
                FY 2026–27
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Apply for leave, track balances, and manage approvals.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Role switcher */}
            <div className="flex rounded-lg border border-border bg-muted/40 p-0.5">
              {ROLES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    role === r
                      ? "bg-background shadow-sm text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <Badge className={cn("border-0 text-xs hidden sm:flex", ROLE_COLORS[role])}>
              Viewing as {role}
            </Badge>

            <Button
              onClick={() => setApplyOpen(true)}
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              size="default"
            >
              <CalendarPlus size={16} />
              Apply Leave
            </Button>
          </div>
        </div>

        {/* ── Leave Balance Cards ──────────────────────────────────────────── */}
        <LeaveBalanceCards balances={mockLeaveBalances} />

        {/* ── Analytics + Quick Actions ───────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LeaveAnalyticsCard analytics={mockLeaveAnalytics} />
          </div>

          <div className="space-y-4">
            {/* Quick actions */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Quick Actions
                </p>
                {QUICK_ACTIONS.map(({ label, icon: Icon, description, color }) => (
                  <button
                    key={label}
                    className={cn(
                      "group w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all",
                      color
                    )}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/60 dark:bg-black/20 shadow-sm">
                      <Icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-tight">{label}</p>
                      <p className="text-xs opacity-70">{description}</p>
                    </div>
                    <ChevronRight size={14} className="opacity-40 group-hover:opacity-80 transition-opacity shrink-0" />
                  </button>
                ))}

                {/* Apply leave shortcut */}
                <button
                  onClick={() => setApplyOpen(true)}
                  className="group w-full flex items-center gap-3 rounded-xl p-3 text-left transition-all text-blue-600 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/60 dark:bg-black/20 shadow-sm">
                    <CalendarPlus size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Apply Leave</p>
                    <p className="text-xs opacity-70">Submit new request</p>
                  </div>
                  <ChevronRight size={14} className="opacity-40 group-hover:opacity-80 transition-opacity shrink-0" />
                </button>
              </CardContent>
            </Card>

            {/* Upcoming holidays */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Upcoming Holidays
                </p>
                {mockHolidays
                  .filter((h) => h.date >= new Date().toISOString().split("T")[0])
                  .slice(0, 4)
                  .map((h) => {
                    const d = new Date(h.date + "T00:00:00");
                    return (
                      <div key={h.date} className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 flex-col items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20 text-center">
                          <span className="text-[10px] font-medium text-amber-600 leading-none">
                            {d.toLocaleDateString("en-IN", { month: "short" })}
                          </span>
                          <span className="text-sm font-bold text-amber-700">
                            {d.getDate()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{h.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{h.type}</p>
                        </div>
                      </div>
                    );
                  })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── Calendar + Pending Approvals (conditional) ─────────────────── */}
        <div className={cn("grid gap-5", showApprovals ? "lg:grid-cols-[1fr_380px]" : "")}>
          <LeaveCalendar events={mockCalendarEvents} holidays={mockHolidays} />
          {showApprovals && (
            <PendingApprovalsCard approvals={mockPendingApprovals} />
          )}
        </div>

        {/* ── Leave History Table ─────────────────────────────────────────── */}
        <LeaveHistoryTable requests={mockMyLeaveRequests} />

        {/* ── HR-only: all requests summary ──────────────────────────────── */}
        {role === "HR" && (
          <Card className="border-dashed border-2 border-border bg-muted/20">
            <CardContent className="p-6 text-center space-y-2">
              <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CalendarDays size={22} className="text-green-600" />
              </div>
              <p className="font-semibold">HR Analytics View</p>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Organisation-wide leave reports, policy configuration, and team analytics will be available here once the backend API is connected.
              </p>
            </CardContent>
          </Card>
        )}

      </div>
    </>
  );
}
