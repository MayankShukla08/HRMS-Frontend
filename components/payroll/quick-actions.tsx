"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download, FileText, Receipt, CreditCard, BarChart2,
  HelpCircle, ChevronRight, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  iconBg: string;
  badge?: string;
  badgeClass?: string;
}

const ACTIONS: QuickAction[] = [
  {
    label:       "Download Latest Payslip",
    description: "June 2026 — PDF",
    icon:        Download,
    color:       "hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10",
    iconBg:      "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
    badge:       "New",
    badgeClass:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
  {
    label:       "Download Form 16",
    description: "FY 2025–26 tax certificate",
    icon:        FileText,
    color:       "hover:border-green-200 dark:hover:border-green-800 hover:bg-green-50/50 dark:hover:bg-green-900/10",
    iconBg:      "bg-green-50 dark:bg-green-900/20 text-green-600",
  },
  {
    label:       "View Tax Details",
    description: "TDS, declarations & exemptions",
    icon:        Receipt,
    color:       "hover:border-amber-200 dark:hover:border-amber-800 hover:bg-amber-50/50 dark:hover:bg-amber-900/10",
    iconBg:      "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
  },
  {
    label:       "Update Bank Account",
    description: "Change salary account details",
    icon:        CreditCard,
    color:       "hover:border-violet-200 dark:hover:border-violet-800 hover:bg-violet-50/50 dark:hover:bg-violet-900/10",
    iconBg:      "bg-violet-50 dark:bg-violet-900/20 text-violet-600",
    badge:       "Action Required",
    badgeClass:  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    label:       "Salary Structure",
    description: "View CTC & component details",
    icon:        BarChart2,
    color:       "hover:border-teal-200 dark:hover:border-teal-800 hover:bg-teal-50/50 dark:hover:bg-teal-900/10",
    iconBg:      "bg-teal-50 dark:bg-teal-900/20 text-teal-600",
  },
  {
    label:       "Payroll Help",
    description: "FAQs & support tickets",
    icon:        HelpCircle,
    color:       "hover:border-slate-300 dark:hover:border-slate-600 hover:bg-muted/60",
    iconBg:      "bg-muted text-muted-foreground",
  },
];

export function PayrollQuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Zap size={15} className="text-primary" />
          </div>
          <CardTitle className="text-base font-semibold">Quick Actions</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border border-border p-4 text-left transition-all hover:shadow-sm active:scale-[0.98]",
                  action.color
                )}
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-sm", action.iconBg)}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold leading-tight truncate">{action.label}</p>
                    {action.badge && (
                      <Badge className={cn("border-0 text-[10px] px-1.5 h-4", action.badgeClass)}>
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                </div>
                <ChevronRight
                  size={15}
                  className="shrink-0 text-muted-foreground opacity-40 group-hover:opacity-80 group-hover:translate-x-0.5 transition-all"
                />
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
