import { Card, CardContent } from "@/components/ui/card";
import { type Employee } from "@/lib/mock/dashboard-data";
import { Sparkles } from "lucide-react";

interface WelcomeCardProps {
  employee: Employee;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function WelcomeCard({ employee }: WelcomeCardProps) {
  const today = new Date();

  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white shadow-lg">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-8 right-16 h-28 w-28 rounded-full bg-white/5" />

      <CardContent className="relative z-10 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-blue-200 text-sm font-medium">
              <Sparkles size={14} />
              <span>{getGreeting()}</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">{employee.name}</h2>
            <p className="text-blue-100 text-sm">{employee.role}</p>
          </div>

          {/* Avatar initials */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/20 text-white text-lg font-bold backdrop-blur-sm ring-2 ring-white/30">
            {employee.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-white/20 pt-4">
          <div>
            <p className="text-xs text-blue-200 uppercase tracking-wider">Department</p>
            <p className="text-sm font-semibold">{employee.department}</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div>
            <p className="text-xs text-blue-200 uppercase tracking-wider">Employee ID</p>
            <p className="text-sm font-semibold">{employee.id}</p>
          </div>
          <div className="h-8 w-px bg-white/20 hidden sm:block" />
          <div className="hidden sm:block">
            <p className="text-xs text-blue-200 uppercase tracking-wider">Today</p>
            <p className="text-sm font-semibold">{formatDate(today)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
