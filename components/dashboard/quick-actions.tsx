"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Clock, Upload, Receipt, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  description: string;
  href: string;
  color: string;
  hoverColor: string;
}

const actions: QuickAction[] = [
  {
    label: "Apply Leave",
    icon: <CalendarPlus size={18} />,
    description: "Request time off",
    href: "/leave",
    color: "text-violet-600 bg-violet-50 dark:bg-violet-900/20",
    hoverColor: "hover:bg-violet-100 dark:hover:bg-violet-900/30",
  },
  {
    label: "Clock In",
    icon: <Clock size={18} />,
    description: "Mark attendance",
    href: "/attendance",
    color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
    hoverColor: "hover:bg-blue-100 dark:hover:bg-blue-900/30",
  },
  {
    label: "Upload Document",
    icon: <Upload size={18} />,
    description: "Add new files",
    href: "/documents",
    color: "text-teal-600 bg-teal-50 dark:bg-teal-900/20",
    hoverColor: "hover:bg-teal-100 dark:hover:bg-teal-900/30",
  },
  {
    label: "Submit Expense",
    icon: <Receipt size={18} />,
    description: "File a claim",
    href: "/expenses",
    color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
    hoverColor: "hover:bg-amber-100 dark:hover:bg-amber-900/30",
  },
];

export function QuickActions() {
  function handleAction(href: string) {
    window.location.href = href;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Zap size={15} className="text-primary" />
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleAction(action.href)}
              className={cn(
                "group flex flex-col items-center gap-2.5 rounded-xl border border-transparent p-4 text-center transition-all hover:border-border hover:shadow-sm active:scale-[0.97]",
                action.color,
                action.hoverColor
              )}
              aria-label={action.label}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 dark:bg-black/20 shadow-sm group-hover:shadow">
                {action.icon}
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">{action.label}</p>
                <p className="text-xs opacity-70 mt-0.5">{action.description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
