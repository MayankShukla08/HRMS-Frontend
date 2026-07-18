import { Card, CardContent } from "@/components/ui/card";
import { type LeaveBalance } from "@/lib/mock/leave-data";
import { cn } from "@/lib/utils";

interface LeaveBalanceCardsProps {
  balances: LeaveBalance[];
}

const COLOR_MAP: Record<
  string,
  { bar: string; bg: string; text: string; badge: string; ring: string }
> = {
  blue:   { bar: "bg-blue-500",   bg: "bg-blue-50 dark:bg-blue-900/20",   text: "text-blue-700 dark:text-blue-300",   badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",   ring: "ring-blue-200 dark:ring-blue-800" },
  red:    { bar: "bg-red-500",    bg: "bg-red-50 dark:bg-red-900/20",     text: "text-red-700 dark:text-red-300",     badge: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",     ring: "ring-red-200 dark:ring-red-800" },
  teal:   { bar: "bg-teal-500",   bg: "bg-teal-50 dark:bg-teal-900/20",   text: "text-teal-700 dark:text-teal-300",   badge: "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",   ring: "ring-teal-200 dark:ring-teal-800" },
  purple: { bar: "bg-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20", text: "text-purple-700 dark:text-purple-300", badge: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300", ring: "ring-purple-200 dark:ring-purple-800" },
};

export function LeaveBalanceCards({ balances }: LeaveBalanceCardsProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
      {balances.map((balance) => {
        const colors = COLOR_MAP[balance.color] ?? COLOR_MAP.blue;
        const usedPct = Math.round((balance.used / balance.allocated) * 100);
        const remainingPct = 100 - usedPct;

        return (
          <Card
            key={balance.type}
            className={cn("relative overflow-hidden ring-1", colors.ring)}
          >
            {/* Top accent bar */}
            <div className={cn("absolute inset-x-0 top-0 h-1", colors.bar)} />

            <CardContent className="pt-6 pb-5 px-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl text-lg", colors.bg)}>
                  {balance.icon}
                </div>
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", colors.badge)}>
                  {balance.remaining} left
                </span>
              </div>

              {/* Title */}
              <div>
                <p className="text-sm font-semibold text-foreground">{balance.type}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {balance.used} used · {balance.allocated} total
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Used</span>
                  <span className={cn("font-semibold", colors.text)}>{usedPct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all duration-700", colors.bar)}
                    style={{ width: `${usedPct}%` }}
                  />
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[
                  { label: "Total",     val: balance.allocated },
                  { label: "Used",      val: balance.used      },
                  { label: "Remaining", val: balance.remaining },
                ].map(({ label, val }) => (
                  <div key={label} className="text-center rounded-lg bg-muted/40 py-2">
                    <p className={cn("text-base font-bold", label === "Remaining" ? colors.text : "text-foreground")}>
                      {val}
                    </p>
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
