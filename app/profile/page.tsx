import { UserCircle } from "lucide-react";

export const metadata = { title: "Profile – PropVivo HRMS" };

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCircle size={22} className="text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      </div>
      <p className="text-muted-foreground">
        View and update your personal information and settings here.
      </p>
    </div>
  );
}
