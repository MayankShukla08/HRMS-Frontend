import { AttendanceOverview } from "@/components/attendance/attendance-overview";
import { ClockWidget } from "@/components/attendance/clock-widget";
import { AttendanceCalendar } from "@/components/attendance/attendance-calendar";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { OvertimeSummary } from "@/components/attendance/overtime-summary";
import { AttendanceAnalytics } from "@/components/attendance/attendance-analytics";
import {
  mockOverviewStats,
  mockTodayStatus,
  mockAttendanceCalendar,
  mockAttendanceHistory,
  mockOvertimeEntries,
  mockWeeklyTrend,
} from "@/lib/mock/attendance-data";

export const metadata = { title: "Attendance – PropVivo HRMS" };

export default function AttendancePage() {
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">

      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Track your daily attendance, working hours, and overtime for June 2026.
        </p>
      </div>

      {/* Overview stat cards */}
      <AttendanceOverview stats={mockOverviewStats} />

      {/* Clock widget + Calendar — side by side on large screens */}
      <div className="grid gap-5 lg:grid-cols-[360px_1fr]">
        <ClockWidget todayStatus={mockTodayStatus} />
        <AttendanceCalendar records={mockAttendanceCalendar} />
      </div>

      {/* Analytics chart */}
      <AttendanceAnalytics
        calendar={mockAttendanceCalendar}
        weeklyTrend={mockWeeklyTrend}
      />

      {/* Overtime summary */}
      <OvertimeSummary entries={mockOvertimeEntries} />

      {/* Attendance history table */}
      <AttendanceTable records={mockAttendanceHistory} />

    </div>
  );
}
