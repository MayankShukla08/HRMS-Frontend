import { TrendingUp } from "lucide-react";

export const metadata = { title: "Performance – PropVivo HRMS" };

export default function PerformancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <TrendingUp size={22} className="text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Performance</h1>
      </div>
      <p className="text-muted-foreground">
        Manage reviews, goals, and performance appraisals here.
      </p>
    </div>
  );
}
