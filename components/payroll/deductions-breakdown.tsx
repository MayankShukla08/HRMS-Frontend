import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { type DeductionComponent } from "@/lib/mock/payroll-data";
import { TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface DeductionsBreakdownProps {
  deductions: DeductionComponent[];
  totalDeductions: number;
  grossSalary: number;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

// Different red/orange shades for each row
const DEDUCTION_COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#f59e0b", // amber-500
  "#e11d48", // rose-600
  "#64748b", // slate-500
];

export function DeductionsBreakdown({ deductions, totalDeductions, grossSalary }: DeductionsBreakdownProps) {
  const totalPct = Math.round((totalDeductions / grossSalary) * 100);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
              <TrendingDown size={15} className="text-red-500" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Deductions Breakdown</CardTitle>
              <CardDescription className="mt-0">June 2026</CardDescription>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total Deducted</p>
            <p className="text-lg font-bold text-red-600 dark:text-red-400 tabular-nums">
              {fmt(totalDeductions)}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Overall deduction rate */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Deduction rate</span>
            <span className="font-semibold text-red-600">{totalPct}% of gross</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-700"
              style={{ width: `${totalPct}%` }}
            />
          </div>
        </div>

        {/* Individual rows */}
        <div className="space-y-2.5 pt-1">
          {deductions.map((d, i) => {
            const color = DEDUCTION_COLORS[i % DEDUCTION_COLORS.length];
            const barPct = (d.amount / totalDeductions) * 100;
            return (
              <div key={d.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <span className="font-medium truncate">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground w-10 text-right">{d.pct}%</span>
                    <span className="font-semibold text-red-600 dark:text-red-400 tabular-nums w-24 text-right">
                      -{fmt(d.amount)}
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${barPct}%`, backgroundColor: color }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Net result */}
        <div className="rounded-xl border border-dashed border-border p-3 mt-2 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gross Earnings</span>
            <span className="font-semibold tabular-nums">{fmt(grossSalary)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Deductions</span>
            <span className="font-semibold text-red-600 tabular-nums">-{fmt(totalDeductions)}</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-sm font-bold">
            <span>Net Take-Home</span>
            <span className="text-green-700 dark:text-green-400 tabular-nums">{fmt(grossSalary - totalDeductions)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
