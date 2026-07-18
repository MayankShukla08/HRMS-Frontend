import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type PayrollSummary } from "@/lib/mock/dashboard-data";
import { IndianRupee, FileText, TrendingDown, Banknote } from "lucide-react";

interface PayrollCardProps {
  data: PayrollSummary;
}

function formatCurrency(amount: number, currency: string): string {
  if (currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PayrollCard({ data }: PayrollCardProps) {
  const taxPct = Math.round((data.taxDeduction / data.currentSalary) * 100);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Payroll Summary</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 dark:bg-green-900/20">
            <IndianRupee size={15} className="text-green-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* CTC */}
        <div className="rounded-lg border border-dashed border-border p-3 space-y-0.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Current CTC</p>
          <p className="text-2xl font-bold text-foreground">
            {formatCurrency(data.currentSalary, data.currency)}
          </p>
          <p className="text-xs text-muted-foreground">per annum</p>
        </div>

        {/* Net Pay */}
        <div className="flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-3">
          <Banknote size={16} className="text-green-600 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Net Pay (Monthly)</p>
            <p className="text-sm font-bold text-green-700 dark:text-green-400">
              {formatCurrency(data.netPay, data.currency)}
            </p>
          </div>
        </div>

        {/* Tax */}
        <div className="flex items-center gap-3 rounded-lg bg-red-50 dark:bg-red-900/20 p-3">
          <TrendingDown size={16} className="text-red-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground">Tax Deduction ({taxPct}%)</p>
            <p className="text-sm font-bold text-red-600 dark:text-red-400">
              -{formatCurrency(data.taxDeduction, data.currency)}
            </p>
          </div>
        </div>

        {/* Last payslip */}
        <div className="flex items-center gap-3 pt-1">
          <FileText size={14} className="text-muted-foreground shrink-0" />
          <p className="text-xs text-muted-foreground">
            Last payslip:{" "}
            <span className="font-medium text-foreground">{data.lastPayslipDate}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
