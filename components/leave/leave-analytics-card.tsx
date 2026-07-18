import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type LeaveAnalytics } from "@/lib/mock/leave-data";
import { BarChart2, CheckCircle2, Clock, XCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaveAnalyticsCardProps {
  analytics: LeaveAnalytics;
}

function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex-1 flex flex-col items-center gap-1">
      <div className="relative w-full h-20 flex items-end">
        <div
          className={cn("w-full rounded-t-md transition-all duration-700", color)}
          style={{ height: `${Math.max(pct, 4)}%` }}
        />
      </div>
    </div>
  );
}

export function LeaveAnalyticsCard({ analytics }: LeaveAnalyticsCardProps) {
  const maxMonthly = Math.max(...analytics.monthlyBreakdown.map((m) => m.days), 1);
  const totalTypedays = analytics.typeBreakdown.reduce((s, t) => s + t.days, 0);

  const summaryCards = [
    { label: "Total Taken",       value: analytics.totalTaken, icon: CalendarDays, bg: "bg-blue-50 dark:bg-blue-900/20",   text: "text-blue-600",   iconC: "text-blue-500"   },
    { label: "Approved",          value: analytics.approved,   icon: CheckCircle2, bg: "bg-green-50 dark:bg-green-900/20", text: "text-green-600",  iconC: "text-green-500"  },
    { label: "Pending",           value: analytics.pending,    icon: Clock,        bg: "bg-amber-50 dark:bg-amber-900/20", text: "text-amber-600",  iconC: "text-amber-500"  },
    { label: "Rejected",          value: analytics.rejected,   icon: XCircle,      bg: "bg-red-50 dark:bg-red-900/20",     text: "text-red-600",    iconC: "text-red-500"    },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <BarChart2 size={15} className="text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Leave Analytics</CardTitle>
            <CardDescription>Current year overview</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {summaryCards.map(({ label, value, icon: Icon, bg, text, iconC }) => (
            <div key={label} className={cn("rounded-xl p-3 flex items-center gap-3", bg)}>
              <Icon size={18} className={iconC} />
              <div>
                <p className={cn("text-xl font-bold", text)}>{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Monthly bar chart — 3 cols */}
          <div className="md:col-span-3 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Monthly Trend (days taken)
            </p>
            <div className="flex items-end gap-1 h-24">
              {analytics.monthlyBreakdown.map((m) => {
                const pct = (m.days / maxMonthly) * 100;
                return (
                  <div key={m.month} className="group flex flex-1 flex-col items-center gap-1">
                    <div className="w-full flex-1 flex flex-col items-center justify-end relative">
                      {m.days > 0 && (
                        <span className="absolute -top-4 text-[9px] font-semibold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          {m.days}d
                        </span>
                      )}
                      <div
                        className={cn(
                          "w-full rounded-t-md transition-all duration-700",
                          m.days > 0 ? "bg-blue-500" : "bg-muted"
                        )}
                        style={{ height: `${Math.max(pct, 6)}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-muted-foreground">{m.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Type breakdown — 2 cols */}
          <div className="md:col-span-2 space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              By Leave Type
            </p>
            <div className="space-y-2.5">
              {analytics.typeBreakdown.map((t) => {
                const pct = totalTypedays > 0 ? Math.round((t.days / totalTypedays) * 100) : 0;
                return (
                  <div key={t.type} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground truncate pr-2">{t.type}</span>
                      <span className="font-semibold text-foreground shrink-0">{t.days}d</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: t.color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
