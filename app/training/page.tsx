import { BookOpen } from "lucide-react";

export const metadata = { title: "Training – PropVivo HRMS" };

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen size={22} className="text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Training</h1>
      </div>
      <p className="text-muted-foreground">
        Browse and enroll in training programs and courses here.
      </p>
    </div>
  );
}
