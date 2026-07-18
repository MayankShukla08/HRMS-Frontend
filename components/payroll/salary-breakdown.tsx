import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type EarningComponent } from "@/lib/mock/payroll-data";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalaryBreakdownProps {
  earnings: EarningComponent[];
  totalGross: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function SalaryBreakdown({ earnings, totalGross }: SalaryBreakdownProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
              <TrendingUp size={15} className="text-green-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Earnings Breakdown</CardTitle>
              <CardDescription className="mt-0">June 2026</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Gross Total</p>
            <p className="text-lg font-bold text-green-700 dark:text-green-400 tabular-nums">
              {fmt(totalGross)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Stacked bar */}
        <div className="flex h-3 w-full overflow-hidden rounded-full gap-0.5">
          {earnings.map((e) => (
            <div
              key={e.label}
              className="h-full first:rounded-l-full last:rounded-r-full transition-all"
              style={{ width: `${e.pct}%`, backgroundColor: e.color }}
              title={`${e.label}: ${e.pct}%`}
            />
          ))}
        </div>

        {/* Rows */}
        <div className="space-y-2.5 pt-1">
          {earnings.map((e) => (
            <div key={e.label} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: e.color }}
                  />
                  <span className="font-medium truncate">{e.label}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-muted-foreground w-10 text-right">{e.pct}%</span>
                  <span className="font-semibold tabular-nums w-24 text-right">{fmt(e.amount)}</span>
                </div>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${e.pct}%`, backgroundColor: e.color }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total row */}
        <div className="flex items-center justify-between rounded-xl bg-green-50 dark:bg-green-900/20 px-4 py-3 mt-2">
          <span className="text-sm font-semibold">Total Gross Earnings</span>
          <span className="text-lg font-bold text-green-700 dark:text-green-400 tabular-nums">
            {fmt(totalGross)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
