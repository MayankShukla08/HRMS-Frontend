import { PayrollOverview }     from "@/components/payroll/payroll-overview";
import { SalaryBreakdown }     from "@/components/payroll/salary-breakdown";
import { DeductionsBreakdown } from "@/components/payroll/deductions-breakdown";
import { PayrollInsights }     from "@/components/payroll/payroll-insights";
import { PayslipHistory }      from "@/components/payroll/payslip-history";
import { PayrollQuickActions } from "@/components/payroll/quick-actions";
import {
  mockPayrollKPIs,
  mockPayrollProfile,
  mockEarnings,
  mockDeductions,
  mockPayslipHistory,
  mockSalaryTrend,
  totalGross,
  totalDeductions,
} from "@/lib/mock/payroll-data";
import { Badge } from "@/components/ui/badge";
import { IndianRupee } from "lucide-react";

export const metadata = { title: "Payroll – PropVivo HRMS" };

export default function PayrollPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight">Payroll</h1>
            <Badge className="border-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs gap-1">
              <IndianRupee size={10} />
              June 2026
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-1">
            Your salary breakdown, payslip history, and earnings insights.
          </p>
        </div>
      </div>

      {/* Section 1 + 2 — KPIs & Employee Profile */}
      <PayrollOverview kpis={mockPayrollKPIs} profile={mockPayrollProfile} />

      {/* Section 3 + 4 — Earnings & Deductions */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SalaryBreakdown earnings={mockEarnings} totalGross={totalGross} />
        <DeductionsBreakdown
          deductions={mockDeductions}
          totalDeductions={totalDeductions}
          grossSalary={totalGross}
        />
      </div>

      {/* Section 5 — Payroll Analytics */}
      <PayrollInsights trend={mockSalaryTrend} history={mockPayslipHistory} />

      {/* Section 7 — Quick Actions */}
      <PayrollQuickActions />

      {/* Section 6 — Payslip History */}
      <PayslipHistory records={mockPayslipHistory} />

    </div>
  );
}
