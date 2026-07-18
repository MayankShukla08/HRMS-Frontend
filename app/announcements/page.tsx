import { Megaphone } from "lucide-react";

export const metadata = { title: "Announcements – PropVivo HRMS" };

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Megaphone size={22} className="text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Announcements</h1>
      </div>
      <p className="text-muted-foreground">
        Company-wide announcements and notices will appear here.
      </p>
    </div>
  );
}
