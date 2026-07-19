// Mock data for the Payroll Management module
// All amounts are in INR (Indian Rupees)

export type PaymentStatus = "Paid" | "Processing" | "Pending";

export interface EmployeePayrollProfile {
  id: string;
  name: string;
  department: string;
  designation: string;
  employeeId: string;
  joiningDate: string;
  salaryAccount: string;
  bankName: string;
  ifscCode: string;
  paymentStatus: PaymentStatus;
  lastPaymentDate: string;
  payrollMonth: string;
}

export interface EarningComponent {
  label: string;
  amount: number;
  pct: number; // % of gross
  color: string;
}

export interface DeductionComponent {
  label: string;
  amount: number;
  pct: number; // % of gross
}

export interface PayrollKPI {
  label: string;
  current: number;
  previous: number;
  trend: "up" | "down" | "flat";
  trendPct: number;
}

export interface MonthlySalaryRecord {
  month: string;       // "Jun 2026"
  monthKey: string;    // "2026-06"
  gross: number;
  deductions: number;
  net: number;
  tax: number;
  status: PaymentStatus;
}

export interface SalaryTrendPoint {
  month: string;
  gross: number;
  deductions: number;
  net: number;
}

// ─── Employee Profile ──────────────────────────────────────────────────────────

export const mockPayrollProfile: EmployeePayrollProfile = {
  id:              "EMP-00142",
  name:            "Mayank Shukla",
  department:      "Engineering",
  designation:     "Senior Software Engineer",
  employeeId:      "EMP-00142",
  joiningDate:     "Mar 15, 2022",
  salaryAccount:   "XXXX XXXX 4821",
  bankName:        "HDFC Bank",
  ifscCode:        "HDFC0001234",
  paymentStatus:   "Paid",
  lastPaymentDate: "Jun 1, 2026",
  payrollMonth:    "June 2026",
};

// ─── KPI Cards ─────────────────────────────────────────────────────────────────

export const mockPayrollKPIs: PayrollKPI[] = [
  { label: "Net Salary",        current: 68_200, previous: 66_800, trend: "up",   trendPct: 2.1  },
  { label: "Gross Salary",      current: 85_000, previous: 85_000, trend: "flat", trendPct: 0    },
  { label: "Total Deductions",  current: 16_800, previous: 18_200, trend: "down", trendPct: 7.7  },
  { label: "Tax Paid (TDS)",    current: 10_500, previous: 11_400, trend: "down", trendPct: 7.9  },
];

// ─── Earnings ──────────────────────────────────────────────────────────────────

export const mockEarnings: EarningComponent[] = [
  { label: "Basic Salary",           amount: 42_500, pct: 50.0, color: "#3b82f6" },
  { label: "HRA",                    amount: 17_000, pct: 20.0, color: "#8b5cf6" },
  { label: "Special Allowance",      amount: 12_750, pct: 15.0, color: "#14b8a6" },
  { label: "Performance Incentive",  amount: 6_800,  pct:  8.0, color: "#f59e0b" },
  { label: "Bonus",                  amount: 4_250,  pct:  5.0, color: "#22c55e" },
  { label: "Reimbursements",         amount: 1_700,  pct:  2.0, color: "#64748b" },
];

export const totalGross = mockEarnings.reduce((s, e) => s + e.amount, 0); // 85_000

// ─── Deductions ────────────────────────────────────────────────────────────────

export const mockDeductions: DeductionComponent[] = [
  { label: "Income Tax (TDS)",    amount: 10_500, pct: 12.4 },
  { label: "Provident Fund (PF)", amount: 3_400,  pct:  4.0 },
  { label: "Professional Tax",    amount: 200,    pct:  0.2 },
  { label: "Health Insurance",    amount: 1_800,  pct:  2.1 },
  { label: "Other Deductions",    amount: 900,    pct:  1.1 },
];

export const totalDeductions = mockDeductions.reduce((s, d) => s + d.amount, 0); // 16_800

// ─── Payslip History ───────────────────────────────────────────────────────────

export const mockPayslipHistory: MonthlySalaryRecord[] = [
  { month: "Jun 2026", monthKey: "2026-06", gross: 85_000, deductions: 16_800, net: 68_200, tax: 10_500, status: "Paid"       },
  { month: "May 2026", monthKey: "2026-05", gross: 85_000, deductions: 18_200, net: 66_800, tax: 11_400, status: "Paid"       },
  { month: "Apr 2026", monthKey: "2026-04", gross: 85_000, deductions: 16_900, net: 68_100, tax: 10_500, status: "Paid"       },
  { month: "Mar 2026", monthKey: "2026-03", gross: 80_000, deductions: 15_800, net: 64_200, tax:  9_800, status: "Paid"       },
  { month: "Feb 2026", monthKey: "2026-02", gross: 80_000, deductions: 15_800, net: 64_200, tax:  9_800, status: "Paid"       },
  { month: "Jan 2026", monthKey: "2026-01", gross: 80_000, deductions: 16_100, net: 63_900, tax: 10_100, status: "Paid"       },
  { month: "Dec 2025", monthKey: "2025-12", gross: 95_000, deductions: 18_500, net: 76_500, tax: 11_800, status: "Paid"       }, // with bonus
  { month: "Nov 2025", monthKey: "2025-11", gross: 75_000, deductions: 14_900, net: 60_100, tax:  9_200, status: "Paid"       },
  { month: "Oct 2025", monthKey: "2025-10", gross: 75_000, deductions: 14_900, net: 60_100, tax:  9_200, status: "Paid"       },
  { month: "Sep 2025", monthKey: "2025-09", gross: 75_000, deductions: 14_900, net: 60_100, tax:  9_200, status: "Paid"       },
  { month: "Aug 2025", monthKey: "2025-08", gross: 75_000, deductions: 14_900, net: 60_100, tax:  9_200, status: "Paid"       },
  { month: "Jul 2025", monthKey: "2025-07", gross: 75_000, deductions: 14_900, net: 60_100, tax:  9_200, status: "Paid"       },
  { month: "Jun 2025", monthKey: "2025-06", gross: 72_000, deductions: 14_300, net: 57_700, tax:  8_800, status: "Paid"       },
];

// ─── Trend data (last 12 months for chart) ────────────────────────────────────

export const mockSalaryTrend: SalaryTrendPoint[] = mockPayslipHistory
  .slice(0, 12)
  .reverse()
  .map((r) => ({ month: r.month.split(" ")[0], gross: r.gross, deductions: r.deductions, net: r.net }));

// ─── YTD summary (2026) ────────────────────────────────────────────────────────

export const mockYTDSummary = {
  grossEarned:    mockPayslipHistory.filter(r => r.monthKey.startsWith("2026")).reduce((s, r) => s + r.gross,      0),
  totalDeducted:  mockPayslipHistory.filter(r => r.monthKey.startsWith("2026")).reduce((s, r) => s + r.deductions, 0),
  netReceived:    mockPayslipHistory.filter(r => r.monthKey.startsWith("2026")).reduce((s, r) => s + r.net,        0),
  taxPaid:        mockPayslipHistory.filter(r => r.monthKey.startsWith("2026")).reduce((s, r) => s + r.tax,        0),
};
