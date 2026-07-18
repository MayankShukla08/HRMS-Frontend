import { WelcomeCard } from "@/components/dashboard/welcome-card";
import { AttendanceCard } from "@/components/dashboard/attendance-card";
import { LeaveCard } from "@/components/dashboard/leave-card";
import { PayrollCard } from "@/components/dashboard/payroll-card";
import { TrainingCard } from "@/components/dashboard/training-card";
import { AnnouncementCard } from "@/components/dashboard/announcement-card";
import { TeamCard } from "@/components/dashboard/team-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import {
  mockCurrentEmployee,
  mockAttendance,
  mockLeaveBalance,
  mockPayroll,
  mockTrainings,
  mockAnnouncements,
  mockTeamOverview,
} from "@/lib/mock/dashboard-data";

export const metadata = { title: "Dashboard – PropVivo HRMS" };

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Welcome banner */}
      <WelcomeCard employee={mockCurrentEmployee} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Primary widgets — 3 columns */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AttendanceCard data={mockAttendance} />
        <LeaveCard data={mockLeaveBalance} />
        <PayrollCard data={mockPayroll} />
      </div>

      {/* Secondary widgets — 2 columns */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <TeamCard data={mockTeamOverview} />
        </div>
        <div className="xl:col-span-1">
          <TrainingCard trainings={mockTrainings} />
        </div>
        <div className="xl:col-span-1">
          <AnnouncementCard announcements={mockAnnouncements} />
        </div>
      </div>
    </div>
  );
}
