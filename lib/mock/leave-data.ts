// Mock data for the Leave Management module
// Replace with real API calls when backend is ready

export type LeaveType =
  | "Casual Leave"
  | "Sick Leave"
  | "Personal Leave"
  | "Comp Off"
  | "Maternity Leave"
  | "Paternity Leave"
  | "Bereavement Leave";

export type LeaveStatus = "Approved" | "Pending" | "Rejected" | "Cancelled";

export type UserRole = "Employee" | "Manager" | "HR";

export interface LeaveBalance {
  type: LeaveType;
  allocated: number;
  used: number;
  remaining: number;
  color: string;
  icon: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  approvedBy?: string;
  approvedDate?: string;
  rejectionReason?: string;
  emergencyContact?: string;
  attachmentName?: string;
}

export interface CalendarEvent {
  date: string;
  type: "approved" | "team" | "holiday" | "weekend" | "pending";
  label: string;
  employeeName?: string;
}

export interface LeaveAnalytics {
  totalTaken: number;
  pending: number;
  approved: number;
  rejected: number;
  monthlyBreakdown: { month: string; days: number }[];
  typeBreakdown: { type: string; days: number; color: string }[];
}

export interface TeamMemberLeave {
  employeeId: string;
  name: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: LeaveStatus;
}

export interface Holiday {
  date: string;
  name: string;
  type: "national" | "regional" | "optional";
}

// ─── Current user ──────────────────────────────────────────────────────────────

export const mockCurrentRole: UserRole = "Manager";

// ─── Leave Balances ────────────────────────────────────────────────────────────

export const mockLeaveBalances: LeaveBalance[] = [
  { type: "Casual Leave",   allocated: 12, used: 3,  remaining: 9,  color: "blue",   icon: "☀️" },
  { type: "Sick Leave",     allocated: 10, used: 1,  remaining: 9,  color: "red",    icon: "🏥" },
  { type: "Personal Leave", allocated: 5,  used: 0,  remaining: 5,  color: "teal",   icon: "🌿" },
  { type: "Comp Off",       allocated: 4,  used: 2,  remaining: 2,  color: "purple", icon: "⏰" },
];

// ─── My Leave Requests ─────────────────────────────────────────────────────────

export const mockMyLeaveRequests: LeaveRequest[] = [
  {
    id: "LV-2026-001",
    employeeId: "EMP-00142",
    employeeName: "Arjun Mehta",
    department: "Engineering",
    leaveType: "Casual Leave",
    startDate: "2026-06-19",
    endDate: "2026-06-19",
    days: 1,
    reason: "Personal work — bank errand and home maintenance.",
    status: "Approved",
    appliedDate: "2026-06-15",
    approvedBy: "Priya Sharma",
    approvedDate: "2026-06-16",
  },
  {
    id: "LV-2026-002",
    employeeId: "EMP-00142",
    employeeName: "Arjun Mehta",
    department: "Engineering",
    leaveType: "Sick Leave",
    startDate: "2026-05-12",
    endDate: "2026-05-12",
    days: 1,
    reason: "Fever and flu — doctor advised rest for the day.",
    status: "Approved",
    appliedDate: "2026-05-12",
    approvedBy: "Priya Sharma",
    approvedDate: "2026-05-12",
    attachmentName: "medical_certificate.pdf",
  },
  {
    id: "LV-2026-003",
    employeeId: "EMP-00142",
    employeeName: "Arjun Mehta",
    department: "Engineering",
    leaveType: "Comp Off",
    startDate: "2026-05-02",
    endDate: "2026-05-02",
    days: 1,
    reason: "Compensatory off for weekend sprint delivery on Apr 26.",
    status: "Approved",
    appliedDate: "2026-04-28",
    approvedBy: "Priya Sharma",
    approvedDate: "2026-04-29",
  },
  {
    id: "LV-2026-004",
    employeeId: "EMP-00142",
    employeeName: "Arjun Mehta",
    department: "Engineering",
    leaveType: "Casual Leave",
    startDate: "2026-07-07",
    endDate: "2026-07-09",
    days: 3,
    reason: "Family vacation — travelling out of city.",
    status: "Pending",
    appliedDate: "2026-06-22",
    emergencyContact: "+91 98765 43210",
  },
  {
    id: "LV-2026-005",
    employeeId: "EMP-00142",
    employeeName: "Arjun Mehta",
    department: "Engineering",
    leaveType: "Personal Leave",
    startDate: "2026-04-10",
    endDate: "2026-04-11",
    days: 2,
    reason: "Relocation assistance for a family member.",
    status: "Rejected",
    appliedDate: "2026-04-05",
    rejectionReason: "Critical project delivery phase — team unavailability.",
  },
  {
    id: "LV-2026-006",
    employeeId: "EMP-00142",
    employeeName: "Arjun Mehta",
    department: "Engineering",
    leaveType: "Comp Off",
    startDate: "2026-03-21",
    endDate: "2026-03-21",
    days: 1,
    reason: "Comp off for Saturday support deployment.",
    status: "Cancelled",
    appliedDate: "2026-03-18",
  },
];

// ─── Pending Approvals (Manager/HR view) ──────────────────────────────────────

export const mockPendingApprovals: LeaveRequest[] = [
  {
    id: "LV-2026-101",
    employeeId: "EMP-00156",
    employeeName: "Riya Kapoor",
    department: "Design",
    leaveType: "Casual Leave",
    startDate: "2026-06-30",
    endDate: "2026-07-01",
    days: 2,
    reason: "Attending a sibling's wedding ceremony out of town.",
    status: "Pending",
    appliedDate: "2026-06-22",
    emergencyContact: "+91 99887 76655",
  },
  {
    id: "LV-2026-102",
    employeeId: "EMP-00178",
    employeeName: "Kunal Verma",
    department: "Engineering",
    leaveType: "Sick Leave",
    startDate: "2026-06-25",
    endDate: "2026-06-26",
    days: 2,
    reason: "Dental surgery — doctor recommended 2 days rest post-procedure.",
    status: "Pending",
    appliedDate: "2026-06-23",
    attachmentName: "dental_certificate.pdf",
  },
  {
    id: "LV-2026-103",
    employeeId: "EMP-00190",
    employeeName: "Sneha Nair",
    department: "Product",
    leaveType: "Personal Leave",
    startDate: "2026-07-03",
    endDate: "2026-07-04",
    days: 2,
    reason: "Parents visiting from Kochi — need to be available for them.",
    status: "Pending",
    appliedDate: "2026-06-20",
  },
];

// ─── Calendar Events ───────────────────────────────────────────────────────────

export const mockCalendarEvents: CalendarEvent[] = [
  { date: "2026-06-19", type: "approved", label: "My Leave", employeeName: "You" },
  { date: "2026-06-25", type: "team",     label: "Team Leave", employeeName: "Kunal Verma" },
  { date: "2026-06-26", type: "team",     label: "Team Leave", employeeName: "Kunal Verma" },
  { date: "2026-07-03", type: "holiday",  label: "Independence Day" },
  { date: "2026-06-06", type: "weekend",  label: "Weekend" },
  { date: "2026-06-07", type: "weekend",  label: "Weekend" },
  { date: "2026-06-13", type: "weekend",  label: "Weekend" },
  { date: "2026-06-14", type: "weekend",  label: "Weekend" },
  { date: "2026-06-20", type: "weekend",  label: "Weekend" },
  { date: "2026-06-21", type: "weekend",  label: "Weekend" },
  { date: "2026-06-27", type: "weekend",  label: "Weekend" },
  { date: "2026-06-28", type: "weekend",  label: "Weekend" },
];

// ─── Analytics ────────────────────────────────────────────────────────────────

export const mockLeaveAnalytics: LeaveAnalytics = {
  totalTaken: 6,
  pending: 1,
  approved: 4,
  rejected: 1,
  monthlyBreakdown: [
    { month: "Jan", days: 0 },
    { month: "Feb", days: 0 },
    { month: "Mar", days: 1 },
    { month: "Apr", days: 2 },
    { month: "May", days: 2 },
    { month: "Jun", days: 1 },
    { month: "Jul", days: 0 },
    { month: "Aug", days: 0 },
    { month: "Sep", days: 0 },
    { month: "Oct", days: 0 },
    { month: "Nov", days: 0 },
    { month: "Dec", days: 0 },
  ],
  typeBreakdown: [
    { type: "Casual Leave",   days: 4, color: "#3b82f6" },
    { type: "Sick Leave",     days: 1, color: "#ef4444" },
    { type: "Comp Off",       days: 2, color: "#8b5cf6" },
    { type: "Personal Leave", days: 2, color: "#14b8a6" },
  ],
};

// ─── Holidays ─────────────────────────────────────────────────────────────────

export const mockHolidays: Holiday[] = [
  { date: "2026-01-26", name: "Republic Day",          type: "national"  },
  { date: "2026-03-25", name: "Holi",                  type: "national"  },
  { date: "2026-04-14", name: "Dr. Ambedkar Jayanti",  type: "national"  },
  { date: "2026-05-01", name: "Maharashtra Day",        type: "regional"  },
  { date: "2026-08-15", name: "Independence Day",       type: "national"  },
  { date: "2026-10-02", name: "Gandhi Jayanti",         type: "national"  },
  { date: "2026-11-01", name: "Diwali",                 type: "national"  },
  { date: "2026-12-25", name: "Christmas",              type: "national"  },
];

export const LEAVE_TYPES: LeaveType[] = [
  "Casual Leave",
  "Sick Leave",
  "Personal Leave",
  "Comp Off",
  "Maternity Leave",
  "Paternity Leave",
  "Bereavement Leave",
];
