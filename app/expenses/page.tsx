import { Receipt } from "lucide-react";

export const metadata = { title: "Expenses – PropVivo HRMS" };

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Receipt size={22} className="text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight">Expenses</h1>
      </div>
      <p className="text-muted-foreground">
        Submit and track expense claims and reimbursements here.
      </p>
    </div>
  );
}
