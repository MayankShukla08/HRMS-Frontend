"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type DailyAttendance,
  type AttendanceStatus,
} from "@/lib/mock/attendance-data";
import { Search, ClipboardList, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AttendanceTableProps {
  records: DailyAttendance[];
}

const STATUS_BADGE: Record<
  AttendanceStatus,
  { label: string; className: string }
> = {
  present:   { label: "Present",   className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  absent:    { label: "Absent",    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  late:      { label: "Late",      className: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  "half-day":{ label: "Half Day",  className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  holiday:   { label: "Holiday",   className: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" },
  weekend:   { label: "Weekend",   className: "bg-slate-100 text-slate-500 dark:bg-slate-800" },
  "on-leave":{ label: "On Leave",  className: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
};

type SortKey = "date" | "clockIn" | "clockOut" | "workingHours" | "overtimeHours";
type SortDir = "asc" | "desc";

function formatDate(iso: string): string {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AttendanceTable({ records }: AttendanceTableProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const filtered = records
    .filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        r.date.includes(q) ||
        r.status.includes(q) ||
        (r.clockIn ?? "").includes(q) ||
        (r.note ?? "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      let va: number | string = a[sortKey] ?? "";
      let vb: number | string = b[sortKey] ?? "";
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      va = String(va);
      vb = String(vb);
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp size={13} className="opacity-20 ml-1" />;
    return sortDir === "asc"
      ? <ChevronUp size={13} className="ml-1 text-primary" />
      : <ChevronDown size={13} className="ml-1 text-primary" />;
  }

  function SortableTh({ col, label }: { col: SortKey; label: string }) {
    return (
      <TableHead
        className="cursor-pointer select-none whitespace-nowrap"
        onClick={() => toggleSort(col)}
      >
        <span className="inline-flex items-center">
          {label}
          <SortIcon col={col} />
        </span>
      </TableHead>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                <ClipboardList size={15} className="text-slate-600 dark:text-slate-400" />
              </div>
              <CardTitle className="text-base font-semibold">Attendance History</CardTitle>
            </div>
            <CardDescription className="mt-0.5 ml-10">
              Showing {filtered.length} of {records.length} records
            </CardDescription>
          </div>
          {/* Search */}
          <div className="relative sm:w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search records…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <SortableTh col="date" label="Date" />
                <TableHead>Status</TableHead>
                <SortableTh col="clockIn" label="Clock In" />
                <SortableTh col="clockOut" label="Clock Out" />
                <SortableTh col="workingHours" label="Hours" />
                <SortableTh col="overtimeHours" label="Overtime" />
                <TableHead>Note</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No records match your search.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => {
                  const badge = STATUS_BADGE[row.status];
                  return (
                    <TableRow key={row.date}>
                      <TableCell className="font-medium text-xs sm:text-sm whitespace-nowrap">
                        {formatDate(row.date)}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border-0 text-xs", badge.className)}>
                          {badge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {row.clockIn ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {row.clockOut ?? (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span
                          className={cn(
                            "text-sm font-semibold",
                            row.workingHours >= 8
                              ? "text-green-600"
                              : row.workingHours > 0
                              ? "text-amber-600"
                              : "text-muted-foreground"
                          )}
                        >
                          {row.workingHours > 0 ? `${row.workingHours}h` : "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        {row.overtimeHours > 0 ? (
                          <span className="text-sm font-semibold text-purple-600">
                            +{row.overtimeHours}h
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="max-w-[160px]">
                        {row.note ? (
                          <span className="text-xs text-muted-foreground truncate block" title={row.note}>
                            {row.note}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
