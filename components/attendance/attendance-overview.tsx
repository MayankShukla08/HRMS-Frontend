import { Card, CardContent } from "@/components/ui/card";
import { type AttendanceOverviewStats } from "@/lib/mock/attendance-data";
import {
  CheckCircle2,
  XCircle,
  Clock,
  CalendarMinus,
  TrendingUp,
  Timer,
  AlarmClock,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceOverviewProps {
  stats: AttendanceOverviewStats;
}

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  iconBg: string;
  accent?: string;
}

function StatCard({ label, value, sub, icon, iconBg, accent }: StatCardProps) {
  return (
    <Card className="gap-0">
      <CardContent className="flex items-center gap-4 p-5">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", iconBg)}>
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide truncate">
            {label}
          </p>
          <p className={cn("text-2xl font-bold leading-tight", accent ?? "text-foreground")}>
            {value}
          </p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export function AttendanceOverview({ stats }: AttendanceOverviewProps) {
  return (
    <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
      <StatCard
        label="Present Days"
        value={stats.presentDays}
        sub={`of ${stats.totalWorkingDays} working days`}
        icon={<CheckCircle2 size={20} className="text-green-600" />}
        iconBg="bg-green-50 dark:bg-green-900/20"
        accent="text-green-700 dark:text-green-400"
      />
      <StatCard
        label="Absent Days"
        value={stats.absentDays}
        sub="this month"
        icon={<XCircle size={20} className="text-red-500" />}
        iconBg="bg-red-50 dark:bg-red-900/20"
        accent={stats.absentDays > 0 ? "text-red-600 dark:text-red-400" : undefined}
      />
      <StatCard
        label="Late Arrivals"
        value={stats.lateDays}
        sub="times this month"
        icon={<AlarmClock size={20} className="text-orange-500" />}
        iconBg="bg-orange-50 dark:bg-orange-900/20"
        accent={stats.lateDays > 2 ? "text-orange-600 dark:text-orange-400" : undefined}
      />
      <StatCard
        label="Half Days"
        value={stats.halfDays}
        sub="partial days"
        icon={<CalendarMinus size={20} className="text-amber-500" />}
        iconBg="bg-amber-50 dark:bg-amber-900/20"
      />
      <StatCard
        label="Hours Worked"
        value={`${stats.totalHoursWorked}h`}
        sub="total this month"
        icon={<Clock size={20} className="text-blue-500" />}
        iconBg="bg-blue-50 dark:bg-blue-900/20"
      />
      <StatCard
        label="Overtime"
        value={`${stats.totalOvertimeHours}h`}
        sub="extra hours"
        icon={<Timer size={20} className="text-purple-500" />}
        iconBg="bg-purple-50 dark:bg-purple-900/20"
      />
      <StatCard
        label="Avg Clock-In"
        value={stats.avgClockIn}
        sub="average this month"
        icon={<TrendingUp size={20} className="text-teal-500" />}
        iconBg="bg-teal-50 dark:bg-teal-900/20"
      />
      <StatCard
        label="Attendance Rate"
        value={`${stats.attendanceRate}%`}
        sub="punctuality score"
        icon={<LogOut size={20} className="text-indigo-500" />}
        iconBg="bg-indigo-50 dark:bg-indigo-900/20"
        accent="text-indigo-700 dark:text-indigo-400"
      />
    </div>
  );
}
