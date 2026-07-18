// Mock data for the HRMS Dashboard
// Replace with real API calls once backend is ready

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  email: string;
}

export interface AttendanceSummary {
  presentDays: number;
  totalWorkingDays: number;
  workingHours: number;
  overtimeHours: number;
  lateArrivals: number;
  attendanceRate: number;
}

export interface LeaveBalance {
  casual: { used: number; total: number };
  sick: { used: number; total: number };
  personal: { used: number; total: number };
  remaining: number;
}

export interface PayrollSummary {
  currentSalary: number;
  lastPayslipDate: string;
  netPay: number;
  taxDeduction: number;
  currency: string;
}

export interface Training {
  id: string;
  name: string;
  category: string;
  dueDate: string;
  completionStatus: "completed" | "in-progress" | "not-started";
  completionPercent: number;
}

export interface Announcement {
  id: string;
  title: string;
  category: "General" | "Policy" | "Event" | "Urgent" | "HR";
  date: string;
  priority: "low" | "medium" | "high";
  excerpt: string;
}

export interface TeamOverview {
  totalMembers: number;
  pendingApprovals: number;
  openRequests: number;
  onLeaveToday: number;
}

// ─── Mock Records ─────────────────────────────────────────────────────────────

export const mockCurrentEmployee: Employee = {
  id: "EMP-00142",
  name: "Mayank Shukla",
  role: "Senior Software Engineer",
  department: "Engineering",
  email: "mayank.shukla@propvivo.com",
};

export const mockAttendance: AttendanceSummary = {
  presentDays: 21,
  totalWorkingDays: 23,
  workingHours: 168,
  overtimeHours: 6.5,
  lateArrivals: 2,
  attendanceRate: 91.3,
};

export const mockLeaveBalance: LeaveBalance = {
  casual: { used: 3, total: 12 },
  sick: { used: 1, total: 10 },
  personal: { used: 0, total: 5 },
  remaining: 23,
};

export const mockPayroll: PayrollSummary = {
  currentSalary: 85000,
  lastPayslipDate: "June 1, 2026",
  netPay: 68200,
  taxDeduction: 16800,
  currency: "INR",
};

export const mockTrainings: Training[] = [
  {
    id: "TRN-001",
    name: "AWS Cloud Practitioner",
    category: "Technical",
    dueDate: "Jul 15, 2026",
    completionStatus: "in-progress",
    completionPercent: 60,
  },
  {
    id: "TRN-002",
    name: "Workplace Safety & Compliance",
    category: "Compliance",
    dueDate: "Jun 30, 2026",
    completionStatus: "not-started",
    completionPercent: 0,
  },
  {
    id: "TRN-003",
    name: "Leadership Essentials",
    category: "Soft Skills",
    dueDate: "Aug 10, 2026",
    completionStatus: "completed",
    completionPercent: 100,
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ANN-001",
    title: "Q3 2026 All-Hands Meeting Scheduled",
    category: "Event",
    date: "Jun 22, 2026",
    priority: "high",
    excerpt: "Join us for the company-wide all-hands meeting on July 3rd at 11:00 AM IST.",
  },
  {
    id: "ANN-002",
    title: "Updated Work From Home Policy",
    category: "Policy",
    date: "Jun 18, 2026",
    priority: "medium",
    excerpt: "The hybrid work policy has been revised effective July 1, 2026.",
  },
  {
    id: "ANN-003",
    title: "New Health Insurance Benefits",
    category: "HR",
    date: "Jun 15, 2026",
    priority: "low",
    excerpt: "Enhanced medical coverage for all employees and their dependents.",
  },
];

export const mockTeamOverview: TeamOverview = {
  totalMembers: 24,
  pendingApprovals: 3,
  openRequests: 7,
  onLeaveToday: 2,
};
