"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AppFooter } from "@/components/layout/app-footer";
import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":     "Dashboard",
  "/attendance":    "Attendance",
  "/leave":         "Leave Management",
  "/payroll":       "Payroll",
  "/documents":     "Documents",
  "/expenses":      "Expenses",
  "/performance":   "Performance",
  "/training":      "Training",
  "/recruitment":   "Recruitment",
  "/announcements": "Announcements",
  "/analytics":     "Analytics",
  "/settings":      "Settings",
  "/profile":       "Profile",
};

export function HrmsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const pageTitle =
    Object.entries(PAGE_TITLES)
      .filter(([key]) => pathname === key || pathname.startsWith(key + "/"))
      .sort((a, b) => b[0].length - a[0].length)[0]?.[1] ?? "HRMS";

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-svh">
        <DashboardHeader pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
        <AppFooter />
      </SidebarInset>
    </SidebarProvider>
  );
}
