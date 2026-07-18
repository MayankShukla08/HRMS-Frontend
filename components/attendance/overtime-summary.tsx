import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type OvertimeEntry } from "@/lib/mock/attendance-data";
import { Timer, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface OvertimeSummaryProps {
  entries: OvertimeEntry[];
}

export function OvertimeSummary({ entries }: OvertimeSummaryProps) {
  const totalOT = entries.reduce((sum, e) => sum + e.overtimeHours, 0);
  const approvedOT = entries
    .filter((e) => e.approved)
    .reduce((sum, e) => sum + e.overtimeHours, 0);
  const pendingOT = totalOT - approvedOT;
  const approvedCount = entries.filter((e) => e.approved).length;
  const pendingCount = entries.filter((e) => !e.approved).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-900/20">
              <Timer size={15} className="text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Overtime Summary</CardTitle>
              <CardDescription>Current month breakdown</CardDescription>
            </div>
          </div>

          {/* OT Stats */}
          <div className="flex gap-4 text-center">
            <div className="rounded-xl bg-purple-50 dark:bg-purple-900/20 px-4 py-2">
              <p className="text-xl font-bold text-purple-700 dark:text-purple-300">
                {totalOT.toFixed(1)}h
              </p>
              <p className="text-xs text-muted-foreground">Total OT</p>
            </div>
            <div className="rounded-xl bg-green-50 dark:bg-green-900/20 px-4 py-2">
              <p className="text-xl font-bold text-green-700 dark:text-green-400">
                {approvedOT.toFixed(1)}h
              </p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
            <div className="rounded-xl bg-amber-50 dark:bg-amber-900/20 px-4 py-2">
              <p className="text-xl font-bold text-amber-700 dark:text-amber-400">
                {pendingOT.toFixed(1)}h
              </p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>Day</TableHead>
                <TableHead className="text-right">Regular</TableHead>
                <TableHead className="text-right">Overtime</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.date}>
                  <TableCell className="font-medium text-sm">{entry.date}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{entry.day}</TableCell>
                  <TableCell className="text-right font-mono text-sm">
                    {entry.regularHours}h
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono text-sm font-semibold text-purple-600">
                      +{entry.overtimeHours}h
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-mono text-sm font-medium">
                    {entry.total}h
                  </TableCell>
                  <TableCell className="text-center">
                    {entry.approved ? (
                      <Badge className="border-0 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 gap-1">
                        <CheckCircle2 size={11} />
                        Approved
                      </Badge>
                    ) : (
                      <Badge className="border-0 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 gap-1">
                        <Clock size={11} />
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Progress bar */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
            <span>Approval progress</span>
            <span className="font-semibold text-foreground">
              {approvedCount}/{entries.length} approved
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-green-500 transition-all"
              style={{ width: `${(approvedCount / entries.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            {pendingCount} {pendingCount === 1 ? "entry" : "entries"} awaiting manager approval
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
