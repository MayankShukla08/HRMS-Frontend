import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type Training } from "@/lib/mock/dashboard-data";
import { BookOpen, CheckCircle2, Clock, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrainingCardProps {
  trainings: Training[];
}

const statusConfig = {
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    iconClass: "text-green-500",
    badgeClass: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    barClass: "bg-green-500",
  },
  "in-progress": {
    label: "In Progress",
    icon: Clock,
    iconClass: "text-blue-500",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    barClass: "bg-blue-500",
  },
  "not-started": {
    label: "Not Started",
    icon: Circle,
    iconClass: "text-muted-foreground",
    badgeClass: "bg-muted text-muted-foreground",
    barClass: "bg-muted-foreground",
  },
};

export function TrainingCard({ trainings }: TrainingCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Upcoming Training</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
            <BookOpen size={15} className="text-amber-600" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {trainings.map((training) => {
          const config = statusConfig[training.completionStatus];
          const StatusIcon = config.icon;

          return (
            <div
              key={training.id}
              className="rounded-lg border border-border bg-card p-3 space-y-2 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2 min-w-0">
                  <StatusIcon size={15} className={cn("mt-0.5 shrink-0", config.iconClass)} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug truncate">{training.name}</p>
                    <p className="text-xs text-muted-foreground">{training.category}</p>
                  </div>
                </div>
                <Badge className={cn("text-xs shrink-0 border-0 px-2", config.badgeClass)}>
                  {config.label}
                </Badge>
              </div>

              {training.completionStatus !== "not-started" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium">{training.completionPercent}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", config.barClass)}
                      style={{ width: `${training.completionPercent}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Due:{" "}
                <span className="font-medium text-foreground">{training.dueDate}</span>
              </p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
