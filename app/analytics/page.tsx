import { BarChart2 } from "lucide-react";

export const metadata = { title: "Analytics – PropVivo HRMS" };

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart2 size={22} className="text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      </div>
      <p className="text-muted-foreground">
        View workforce reports, charts, and HR insights here.
      </p>
    </div>
  );
}
