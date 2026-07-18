import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LeaveBalance } from "@/lib/mock/dashboard-data";
import { CalendarDays } from "lucide-react";

interface LeaveCardProps {
  data: LeaveBalance;
}

interface LeaveRowProps {
  label: string;
  used: number;
  total: number;
  color: string;
}

function LeaveRow({ label, used, total, color }: LeaveRowProps) {
  const remaining = total - used;
  const pct = Math.round((used / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground text-xs">
          <span className="font-semibold text-foreground">{remaining}</span>/{total} remaining
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function LeaveCard({ data }: LeaveCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Leave Balance</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 dark:bg-violet-900/20">
            <CalendarDays size={15} className="text-violet-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <LeaveRow
          label="Casual Leave"
          used={data.casual.used}
          total={data.casual.total}
          color="bg-blue-500"
        />
        <LeaveRow
          label="Sick Leave"
          used={data.sick.used}
          total={data.sick.total}
          color="bg-red-400"
        />
        <LeaveRow
          label="Personal Leave"
          used={data.personal.used}
          total={data.personal.total}
          color="bg-teal-500"
        />

        <div className="flex items-center justify-between rounded-lg bg-gradient-to-r from-violet-50 to-blue-50 dark:from-violet-900/20 dark:to-blue-900/20 px-4 py-3 mt-2">
          <span className="text-sm font-medium">Total Remaining</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-violet-600">{data.remaining}</span>
            <span className="text-sm text-muted-foreground ml-1">days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
