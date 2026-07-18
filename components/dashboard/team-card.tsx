import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type TeamOverview } from "@/lib/mock/dashboard-data";
import { Users, Clock, FileCheck, CalendarOff } from "lucide-react";

interface TeamCardProps {
  data: TeamOverview;
}

interface MetricTileProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  iconBg: string;
}

function MetricTile({ icon, label, value, iconBg }: MetricTileProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-center hover:border-primary/30 transition-colors">
      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground leading-tight">{label}</p>
    </div>
  );
}

export function TeamCard({ data }: TeamCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Team Overview</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
            <Users size={15} className="text-indigo-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-3">
        <MetricTile
          icon={<Users size={18} className="text-indigo-600" />}
          label="Team Members"
          value={data.totalMembers}
          iconBg="bg-indigo-50 dark:bg-indigo-900/30"
        />
        <MetricTile
          icon={<Clock size={18} className="text-amber-600" />}
          label="Pending Approvals"
          value={data.pendingApprovals}
          iconBg="bg-amber-50 dark:bg-amber-900/30"
        />
        <MetricTile
          icon={<FileCheck size={18} className="text-blue-600" />}
          label="Open Requests"
          value={data.openRequests}
          iconBg="bg-blue-50 dark:bg-blue-900/30"
        />
        <MetricTile
          icon={<CalendarOff size={18} className="text-rose-600" />}
          label="On Leave Today"
          value={data.onLeaveToday}
          iconBg="bg-rose-50 dark:bg-rose-900/30"
        />
      </CardContent>
    </Card>
  );
}
