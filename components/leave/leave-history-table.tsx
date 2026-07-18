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
import { type LeaveRequest, type LeaveStatus } from "@/lib/mock/leave-data";
import {
  Search,
  ClipboardList,
  ChevronUp,
  ChevronDown,
  Paperclip,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaveHistoryTableProps {
  requests: LeaveRequest[];
}

const STATUS_CONFIG: Record<LeaveStatus, { label: string; className: string }> = {
  Approved:  { label: "Approved",  className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"   },
  Pending:   { label: "Pending",   className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"   },
  Rejected:  { label: "Rejected",  className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"           },
  Cancelled: { label: "Cancelled", className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"      },
};

const ALL_STATUSES: LeaveStatus[] = ["Approved", "Pending", "Rejected", "Cancelled"];

type SortKey = "id" | "leaveType" | "startDate" | "days" | "appliedDate";
type SortDir = "asc" | "desc";

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export function LeaveHistoryTable({ requests }: LeaveHistoryTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | "All">("All");
  const [sortKey, setSortKey] = useState<SortKey>("appliedDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const filtered = requests
    .filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.id.toLowerCase().includes(q) ||
        r.leaveType.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q);
      const matchStatus = statusFilter === "All" || r.status === statusFilter;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let va: string | number = a[sortKey] ?? "";
      let vb: string | number = b[sortKey] ?? "";
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      va = String(va); vb = String(vb);
      return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });

  function SortTh({ col, label }: { col: SortKey; label: string }) {
    const active = sortKey === col;
    return (
      <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => toggleSort(col)}>
        <span className="inline-flex items-center gap-1">
          {label}
          {active
            ? sortDir === "asc"
              ? <ChevronUp size={12} className="text-primary" />
              : <ChevronDown size={12} className="text-primary" />
            : <ChevronUp size={12} className="opacity-20" />}
        </span>
      </TableHead>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
              <ClipboardList size={15} className="text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Leave History</CardTitle>
              <CardDescription className="mt-0">
                {filtered.length} of {requests.length} requests
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Status filter pills */}
            <div className="flex gap-1 flex-wrap">
              {(["All", ...ALL_STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
                    statusFilter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 h-8 text-sm w-40"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <SortTh col="id"          label="Request ID"  />
                <SortTh col="leaveType"   label="Leave Type"  />
                <SortTh col="startDate"   label="Start Date"  />
                <TableHead>End Date</TableHead>
                <SortTh col="days"        label="Days"        />
                <TableHead className="max-w-[180px]">Reason</TableHead>
                <TableHead>Status</TableHead>
                <SortTh col="appliedDate" label="Applied"     />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                    No leave requests match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((row) => {
                  const sc = STATUS_CONFIG[row.status];
                  return (
                    <TableRow key={row.id} className="group">
                      <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                        {row.id}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">{row.leaveType}</span>
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {fmtDate(row.startDate)}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap">
                        {fmtDate(row.endDate)}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-sm">{row.days}</span>
                        <span className="text-muted-foreground text-xs ml-1">day{row.days > 1 ? "s" : ""}</span>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <div className="flex items-start gap-1.5">
                          <p className="text-xs text-muted-foreground line-clamp-2" title={row.reason}>
                            {row.reason}
                          </p>
                          {row.attachmentName && (
                            <Paperclip size={12} className="text-muted-foreground shrink-0 mt-0.5" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("border-0 text-xs", sc.className)}>
                          {sc.label}
                        </Badge>
                        {row.rejectionReason && (
                          <p className="text-[10px] text-red-500 mt-0.5 max-w-[120px] truncate" title={row.rejectionReason}>
                            {row.rejectionReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="text-sm whitespace-nowrap text-muted-foreground">
                        {fmtDate(row.appliedDate)}
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
