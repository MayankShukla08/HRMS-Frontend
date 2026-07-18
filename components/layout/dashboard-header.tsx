"use client";

import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Bell, ChevronDown, Settings, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "Employee" | "Manager" | "HR" | "Admin";

const ROLES: Role[] = ["Employee", "Manager", "HR", "Admin"];

const roleColors: Record<Role, string> = {
  Employee: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Manager: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  HR: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

interface DashboardHeaderProps {
  pageTitle?: string;
}

export function DashboardHeader({ pageTitle = "Dashboard" }: DashboardHeaderProps) {
  const [activeRole, setActiveRole] = useState<Role>("Employee");
  const [notifCount] = useState(3);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur-sm px-4">
      {/* Sidebar trigger + separator */}
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-4" />

      {/* Page title */}
      <span className="hidden sm:block text-sm font-semibold text-foreground">{pageTitle}</span>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Search */}
      <div className="relative hidden md:flex items-center">
        <Search
          size={14}
          className="absolute left-3 text-muted-foreground pointer-events-none"
        />
        <Input
          type="search"
          placeholder="Search employees, docs…"
          className="h-8 w-52 pl-8 text-sm bg-muted/50 border-muted focus-visible:ring-1"
          aria-label="Search"
        />
      </div>

      {/* Role switcher */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:flex items-center gap-1.5 h-8 px-2.5"
            aria-label="Switch role"
          >
            <Badge className={cn("text-xs border-0 px-2 py-0.5", roleColors[activeRole])}>
              {activeRole}
            </Badge>
            <ChevronDown size={13} className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel className="text-xs text-muted-foreground">Switch Role</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {ROLES.map((role) => (
            <DropdownMenuItem
              key={role}
              onClick={() => setActiveRole(role)}
              className="cursor-pointer"
            >
              <Badge className={cn("text-xs border-0 px-2 py-0.5 mr-2", roleColors[role])}>
                {role}
              </Badge>
              {activeRole === role && (
                <span className="ml-auto text-primary text-xs">✓</span>
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notifications */}
      <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Notifications">
        <Bell size={16} />
        {notifCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
            {notifCount}
          </span>
        )}
      </Button>

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 h-8 px-2" aria-label="User menu">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                MS
              </AvatarFallback>
            </Avatar>
            <span className="hidden lg:block text-sm font-medium max-w-[100px] truncate">
              Mayank Shukla
            </span>
            <ChevronDown size={13} className="hidden lg:block text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>
            <p className="text-sm font-medium">Mayank Shukla</p>
            <p className="text-xs text-muted-foreground font-normal">mayank.shukla@propvivo.com</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2">
            <User size={14} />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer gap-2">
            <Settings size={14} />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
            <LogOut size={14} />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
