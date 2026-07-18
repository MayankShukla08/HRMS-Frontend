// Mock data for the Attendance Management module
// Replace with real API calls when backend is ready

export type AttendanceStatus =
  | "present"
  | "absent"
  | "late"
  | "half-day"
  | "holiday"
  | "weekend"
  | "on-leave";

export type ShiftType = "morning" | "evening" | "night" | "flexible";

export interface DailyAttendance {
  date: string; // ISO date string YYYY-MM-DD
  status: AttendanceStatus;
  clockIn: string | null; // "HH:MM"
  clockOut: string | null; // "HH:MM"
  workingHours: number; // decimal hours
  overtimeHours: number;
  shift: ShiftType;
  note?: string;
}

export interface AttendanceOverviewStats {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  halfDays: number;
  leaveDays: number;
  totalWorkingDays: number;
  totalHoursWorked: number;
  totalOvertimeHours: number;
  attendanceRate: number; // percentage
  avgClockIn: string;
  avgClockOut: string;
}

export interface OvertimeEntry {
  date: string;
  day: string;
  regularHours: number;
  overtimeHours: number;
  total: number;
  approved: boolean;
}

export interface ClockEvent {
  type: "in" | "out";
  time: string;
  location: string;
}

export interface TodayStatus {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  isClockedIn: boolean;
  workingHours: number;
  shift: ShiftType;
  shiftStart: string;
  shiftEnd: string;
  events: ClockEvent[];
}

export interface WeeklyTrend {
  week: string; // "Mon", "Tue", etc.
  hours: number;
  target: number;
}

// ─── Current month calendar data (June 2026) ──────────────────────────────────

export const mockAttendanceCalendar: DailyAttendance[] = [
  { date: "2026-06-01", status: "present",  clockIn: "09:02", clockOut: "18:15", workingHours: 9.2,  overtimeHours: 1.2, shift: "morning" },
  { date: "2026-06-02", status: "present",  clockIn: "09:10", clockOut: "18:00", workingHours: 8.8,  overtimeHours: 0.8, shift: "morning" },
  { date: "2026-06-03", status: "present",  clockIn: "08:55", clockOut: "17:55", workingHours: 9.0,  overtimeHours: 1.0, shift: "morning" },
  { date: "2026-06-04", status: "present",  clockIn: "09:05", clockOut: "18:05", workingHours: 9.0,  overtimeHours: 1.0, shift: "morning" },
  { date: "2026-06-05", status: "present",  clockIn: "09:20", clockOut: "18:20", workingHours: 9.0,  overtimeHours: 1.0, shift: "morning" },
  { date: "2026-06-06", status: "weekend",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-07", status: "weekend",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-08", status: "present",  clockIn: "09:01", clockOut: "18:01", workingHours: 9.0,  overtimeHours: 1.0, shift: "morning" },
  { date: "2026-06-09", status: "late",     clockIn: "10:15", clockOut: "18:30", workingHours: 8.25, overtimeHours: 0.25, shift: "morning", note: "Traffic delay" },
  { date: "2026-06-10", status: "present",  clockIn: "08:58", clockOut: "17:58", workingHours: 9.0,  overtimeHours: 1.0, shift: "morning" },
  { date: "2026-06-11", status: "present",  clockIn: "09:03", clockOut: "18:45", workingHours: 9.7,  overtimeHours: 1.7, shift: "morning" },
  { date: "2026-06-12", status: "absent",   clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning", note: "Unplanned absence" },
  { date: "2026-06-13", status: "weekend",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-14", status: "weekend",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-15", status: "present",  clockIn: "09:00", clockOut: "18:00", workingHours: 9.0,  overtimeHours: 1.0, shift: "morning" },
  { date: "2026-06-16", status: "half-day", clockIn: "09:05", clockOut: "13:00", workingHours: 3.9,  overtimeHours: 0,   shift: "morning", note: "Doctor appointment" },
  { date: "2026-06-17", status: "present",  clockIn: "08:57", clockOut: "18:10", workingHours: 9.2,  overtimeHours: 1.2, shift: "morning" },
  { date: "2026-06-18", status: "present",  clockIn: "09:08", clockOut: "18:08", workingHours: 9.0,  overtimeHours: 1.0, shift: "morning" },
  { date: "2026-06-19", status: "on-leave", clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning", note: "Approved casual leave" },
  { date: "2026-06-20", status: "weekend",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-21", status: "weekend",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-22", status: "present",  clockIn: "09:00", clockOut: "18:00", workingHours: 9.0,  overtimeHours: 1.0, shift: "morning" },
  { date: "2026-06-23", status: "late",     clockIn: "09:45", clockOut: "19:00", workingHours: 9.25, overtimeHours: 1.25, shift: "morning", note: "Metro disruption" },
  { date: "2026-06-24", status: "present",  clockIn: "08:52", clockOut: "18:00", workingHours: 9.1,  overtimeHours: 1.1, shift: "morning" },
  // Future dates — no data
  { date: "2026-06-25", status: "present",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-26", status: "present",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-27", status: "weekend",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-28", status: "weekend",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-29", status: "present",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
  { date: "2026-06-30", status: "present",  clockIn: null,    clockOut: null,    workingHours: 0,     overtimeHours: 0,   shift: "morning" },
];

export const mockOverviewStats: AttendanceOverviewStats = {
  presentDays: 17,
  absentDays: 1,
  lateDays: 2,
  halfDays: 1,
  leaveDays: 1,
  totalWorkingDays: 22,
  totalHoursWorked: 168.4,
  totalOvertimeHours: 14.55,
  attendanceRate: 90.9,
  avgClockIn: "09:05",
  avgClockOut: "18:10",
};

export const mockTodayStatus: TodayStatus = {
  date: "2026-06-24",
  clockIn: "08:52",
  clockOut: null,
  isClockedIn: true,
  workingHours: 6.3,
  shift: "morning",
  shiftStart: "09:00",
  shiftEnd: "18:00",
  events: [
    { type: "in",  time: "08:52 AM", location: "Office – Main Gate" },
  ],
};

export const mockOvertimeEntries: OvertimeEntry[] = [
  { date: "Jun 01", day: "Mon", regularHours: 8, overtimeHours: 1.2, total: 9.2, approved: true  },
  { date: "Jun 03", day: "Wed", regularHours: 8, overtimeHours: 1.0, total: 9.0, approved: true  },
  { date: "Jun 08", day: "Mon", regularHours: 8, overtimeHours: 1.0, total: 9.0, approved: true  },
  { date: "Jun 11", day: "Thu", regularHours: 8, overtimeHours: 1.7, total: 9.7, approved: false },
  { date: "Jun 17", day: "Wed", regularHours: 8, overtimeHours: 1.2, total: 9.2, approved: true  },
  { date: "Jun 22", day: "Mon", regularHours: 8, overtimeHours: 1.0, total: 9.0, approved: false },
  { date: "Jun 23", day: "Tue", regularHours: 8, overtimeHours: 1.25, total: 9.25, approved: false },
  { date: "Jun 24", day: "Wed", regularHours: 8, overtimeHours: 1.1,  total: 9.1,  approved: false },
];

export const mockWeeklyTrend: WeeklyTrend[] = [
  { week: "Week 1", hours: 45.0, target: 40 },
  { week: "Week 2", hours: 39.25, target: 40 },
  { week: "Week 3", hours: 44.1, target: 40 },
  { week: "Week 4", hours: 40.0, target: 40 },
];

// History table — last 10 working days
export const mockAttendanceHistory: DailyAttendance[] = mockAttendanceCalendar
  .filter((d) => d.clockIn !== null || ["absent", "on-leave", "holiday"].includes(d.status))
  .slice(-10)
  .reverse();
