import { Card, CardContent } from "@/components/ui/card";
import { type PayrollKPI, type EmployeePayrollProfile } from "@/lib/mock/payroll-data";
import {
  Banknote,
  TrendingUp,
  TrendingDown,
  Minus,
  IndianRupee,
  Wallet,
  ReceiptText,
  BadgeIndianRupee,
  Building2,
  CreditCard,
  CalendarDays,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PayrollOverviewProps {
  kpis: PayrollKPI[];
  profile: EmployeePayrollProfile;
}

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

const KPI_ICONS = [Wallet, Banknote, ReceiptText, BadgeIndianRupee];

const KPI_COLORS = [
  { bg: "bg-blue-50 dark:bg-blue-900/20",   icon: "text-blue-600",   val: "text-blue-700 dark:text-blue-300",   ring: "ring-blue-100 dark:ring-blue-900"   },
  { bg: "bg-green-50 dark:bg-green-900/20", icon: "text-green-600",  val: "text-green-700 dark:text-green-300", ring: "ring-green-100 dark:ring-green-900" },
  { bg: "bg-red-50 dark:bg-red-900/20",     icon: "text-red-500",    val: "text-red-700 dark:text-red-300",     ring: "ring-red-100 dark:ring-red-900"     },
  { bg: "bg-amber-50 dark:bg-amber-900/20", icon: "text-amber-600",  val: "text-amber-700 dark:text-amber-300", ring: "ring-amber-100 dark:ring-amber-900" },
];

const STATUS_CONFIG = {
  Paid:       { icon: CheckCircle2, className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Processing: { icon: Clock,        className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"   },
  Pending:    { icon: AlertCircle,  className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
};

export function PayrollOverview({ kpis, profile }: PayrollOverviewProps) {
  const statusCfg = STATUS_CONFIG[profile.paymentStatus];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="space-y-4">
      {/* KPI cards */}
      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi, i) => {
          const Icon = KPI_ICONS[i];
          const colors = KPI_COLORS[i];
          const TrendIcon = kpi.trend === "up" ? TrendingUp : kpi.trend === "down" ? TrendingDown : Minus;
          const trendColor =
            kpi.label.includes("Deduction") || kpi.label.includes("Tax")
              ? kpi.trend === "down" ? "text-green-600" : kpi.trend === "up" ? "text-red-500" : "text-muted-foreground"
              : kpi.trend === "up" ? "text-green-600" : kpi.trend === "down" ? "text-red-500" : "text-muted-foreground";

          return (
            <Card key={kpi.label} className={cn("ring-1 overflow-hidden", colors.ring)}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", colors.bg)}>
                    <Icon size={19} className={colors.icon} />
                  </div>
                  {kpi.trendPct > 0 && (
                    <div className={cn("flex items-center gap-1 text-xs font-semibold", trendColor)}>
                      <TrendIcon size={13} />
                      {kpi.trendPct}%
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">{kpi.label}</p>
                  <p className={cn("text-2xl font-bold mt-0.5 tabular-nums", colors.val)}>
                    {fmt(kpi.current)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground border-t border-border pt-2">
                  vs {fmt(kpi.previous)} last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Employee payroll profile card */}
      <Card className="overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <CardContent className="p-5">
          <div className="flex flex-col sm:flex-row gap-5">
            {/* Avatar */}
            <div className="flex shrink-0 items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold shadow-md">
                {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="sm:hidden">
                <p className="font-bold text-lg leading-tight">{profile.name}</p>
                <p className="text-sm text-muted-foreground">{profile.designation}</p>
                <Badge className={cn("mt-1.5 border-0 text-xs gap-1", statusCfg.className)}>
                  <StatusIcon size={11} />
                  {profile.paymentStatus}
                </Badge>
              </div>
            </div>

            {/* Info grid */}
            <div className="flex-1 min-w-0">
              <div className="hidden sm:flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-bold text-lg leading-tight">{profile.name}</p>
                  <p className="text-sm text-muted-foreground">{profile.designation} · {profile.department}</p>
                </div>
                <Badge className={cn("border-0 text-xs gap-1 shrink-0", statusCfg.className)}>
                  <StatusIcon size={11} />
                  {profile.paymentStatus} — {profile.payrollMonth}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { icon: User,        label: "Employee ID",    val: profile.employeeId      },
                  { icon: Building2,   label: "Department",     val: profile.department      },
                  { icon: CreditCard,  label: "Salary Account", val: profile.salaryAccount   },
                  { icon: Building2,   label: "Bank",           val: profile.bankName        },
                  { icon: CalendarDays,label: "Last Payment",   val: profile.lastPaymentDate },
                  { icon: CalendarDays,label: "Joining Date",   val: profile.joiningDate     },
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-start gap-2.5 rounded-xl bg-muted/40 p-3">
                    <Icon size={14} className="text-muted-foreground mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-medium">{label}</p>
                      <p className="text-sm font-semibold truncate">{val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
