"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Clock,
  CalendarDays,
  DollarSign,
  FileText,
  Receipt,
  TrendingUp,
  BookOpen,
  Users,
  Megaphone,
  BarChart2,
  Settings,
  Building2,
} from "lucide-react";

const NAV_MAIN = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/attendance", label: "Attendance", icon: Clock },
  { href: "/leave", label: "Leave Management", icon: CalendarDays },
  { href: "/payroll", label: "Payroll", icon: DollarSign },
  { href: "/documents", label: "Documents", icon: FileText },
  { href: "/expenses", label: "Expenses", icon: Receipt },
];

const NAV_PEOPLE = [
  { href: "/performance", label: "Performance", icon: TrendingUp },
  { href: "/training", label: "Training", icon: BookOpen },
  { href: "/recruitment", label: "Recruitment", icon: Users },
  { href: "/announcements", label: "Announcements", icon: Megaphone },
];

const NAV_INSIGHTS = [
  { href: "/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <Sidebar collapsible="icon">
      {/* Header / Logo */}
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
                  <Building2 size={16} />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">PropVivo</span>
                  <span className="truncate text-xs text-muted-foreground">HRMS Platform</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Core */}
        <SidebarGroup>
          <SidebarGroupLabel>Core</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_MAIN.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={isActive(href)} tooltip={label}>
                    <Link href={href}>
                      <Icon size={16} />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* People */}
        <SidebarGroup>
          <SidebarGroupLabel>People</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_PEOPLE.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={isActive(href)} tooltip={label}>
                    <Link href={href}>
                      <Icon size={16} />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Insights */}
        <SidebarGroup>
          <SidebarGroupLabel>Insights</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_INSIGHTS.map(({ href, label, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton asChild isActive={isActive(href)} tooltip={label}>
                    <Link href={href}>
                      <Icon size={16} />
                      <span>{label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" className="text-muted-foreground">
              <span className="text-xs">© 2026 PropVivo</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
