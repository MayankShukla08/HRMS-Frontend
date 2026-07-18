import { Users } from "lucide-react";

export const metadata = { title: "Recruitment – PropVivo HRMS" };

export default function RecruitmentPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users size={22} className="text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Recruitment</h1>
      </div>
      <p className="text-muted-foreground">
        Post jobs, review applicants, and manage the hiring pipeline here.
      </p>
    </div>
  );
}
