import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type AttendanceSummary } from "@/lib/mock/dashboard-data";
import { Clock, TrendingUp, AlertCircle, Timer } from "lucide-react";

interface AttendanceCardProps {
  data: AttendanceSummary;
}

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}

function StatItem({ icon, label, value, sub, accent = "text-foreground" }: StatItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className={`text-sm font-semibold ${accent}`}>{value}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}

export function AttendanceCard({ data }: AttendanceCardProps) {
  const pct = Math.round(data.attendanceRate);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Attendance Summary</CardTitle>
          <span className="text-xs font-medium text-muted-foreground bg-muted rounded-full px-2 py-0.5">
            This Month
          </span>
        </div>

        {/* Attendance rate progress */}
        <div className="mt-2 space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">
              {data.presentDays}/{data.totalWorkingDays} days present
            </span>
            <span className="font-semibold text-green-600">{pct}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-2">
        <StatItem
          icon={<Clock size={16} className="text-blue-500" />}
          label="Working Hours"
          value={`${data.workingHours}h`}
          sub="this month"
        />
        <StatItem
          icon={<Timer size={16} className="text-purple-500" />}
          label="Overtime"
          value={`${data.overtimeHours}h`}
          sub="extra hours"
        />
        <StatItem
          icon={<TrendingUp size={16} className="text-green-500" />}
          label="Present Days"
          value={`${data.presentDays}`}
          sub={`of ${data.totalWorkingDays} days`}
        />
        <StatItem
          icon={<AlertCircle size={16} className="text-orange-500" />}
          label="Late Arrivals"
          value={`${data.lateArrivals}`}
          sub="this month"
          accent={data.lateArrivals > 3 ? "text-orange-600" : "text-foreground"}
        />
      </CardContent>
    </Card>
  );
}
