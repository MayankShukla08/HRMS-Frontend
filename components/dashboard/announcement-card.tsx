import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Announcement } from "@/lib/mock/dashboard-data";
import { Megaphone, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnnouncementCardProps {
  announcements: Announcement[];
}

const priorityConfig = {
  high: {
    badgeClass: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    dot: "bg-red-500",
    label: "High",
  },
  medium: {
    badgeClass: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    dot: "bg-amber-500",
    label: "Medium",
  },
  low: {
    badgeClass: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    dot: "bg-slate-400",
    label: "Low",
  },
};

const categoryConfig: Record<string, string> = {
  General: "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Policy: "bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Event: "bg-teal-50 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
  Urgent: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  HR: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
};

export function AnnouncementCard({ announcements }: AnnouncementCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Announcements</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-900/20">
            <Megaphone size={15} className="text-rose-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {announcements.map((ann) => {
          const priority = priorityConfig[ann.priority];
          const catClass = categoryConfig[ann.category] ?? categoryConfig["General"];

          return (
            <div
              key={ann.id}
              className="group flex cursor-pointer items-start gap-3 rounded-lg border border-transparent bg-muted/40 p-3 hover:border-border hover:bg-muted/70 transition-all"
            >
              {/* Priority dot */}
              <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", priority.dot)} />

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={cn("text-xs border-0 px-1.5 py-0", catClass)}>
                    {ann.category}
                  </Badge>
                  <Badge className={cn("text-xs border-0 px-1.5 py-0", priority.badgeClass)}>
                    {priority.label}
                  </Badge>
                </div>
                <p className="text-sm font-medium leading-snug line-clamp-1">{ann.title}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{ann.excerpt}</p>
                <p className="text-xs text-muted-foreground">{ann.date}</p>
              </div>

              <ChevronRight
                size={14}
                className="mt-1 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
