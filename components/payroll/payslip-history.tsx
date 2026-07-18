"use client";

import { useState, useMemo } from "react";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { type MonthlySalaryRecord, type PaymentStatus } from "@/lib/mock/payroll-data";
import {
  Search, Download, FileText, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PayslipHistoryProps {
  records: MonthlySalaryRecord[];
}

const STATUS_CONFIG: Record<PaymentStatus, { className: string }> = {
  Paid:       { className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"   },
  Processing: { className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"       },
  Pending:    { className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"   },
};

const STATUSES: PaymentStatus[] = ["Paid", "Processing", "Pending"];
const YEARS = ["All", "2026", "2025"];
const PAGE_SIZE = 6;

function fmt(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0,
  }).format(n);
}

type SortKey = "month" | "gross" | "deductions" | "net";
type SortDir = "asc" | "desc";

export function PayslipHistory({ records }: PayslipHistoryProps) {
  const [search, setSearch] = useState("");
  const [yearFilter, setYearFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "All">("All");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("month");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const filtered = useMemo(() => {
    return records
      .filter((r) => {
        const q = search.toLowerCase();
        const matchSearch = !q || r.month.toLowerCase().includes(q);
        const matchYear  = yearFilter === "All" || r.monthKey.startsWith(yearFilter);
        const matchStatus = statusFilter === "All" || r.status === statusFilter;
        return matchSearch && matchYear && matchStatus;
      })
      .sort((a, b) => {
        let va: string | number = sortKey === "month" ? a.monthKey : a[sortKey];
        let vb: string | number = sortKey === "month" ? b.monthKey : b[sortKey];
        if (typeof va === "number" && typeof vb === "number") {
          return sortDir === "asc" ? va - vb : vb - va;
        }
        va = String(va); vb = String(vb);
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      });
  }, [records, search, yearFilter, statusFilter, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function SortTh({ col, label, align = "left" }: { col: SortKey; label: string; align?: "left" | "right" }) {
    const active = sortKey === col;
    return (
      <TableHead
        className={cn("cursor-pointer select-none whitespace-nowrap", align === "right" && "text-right")}
        onClick={() => { toggleSort(col); setPage(1); }}
      >
        <span className={cn("inline-flex items-center gap-1", align === "right" && "justify-end w-full")}>
          {label}
          {active
            ? sortDir === "asc" ? <ChevronUp size={12} className="text-primary" /> : <ChevronDown size={12} className="text-primary" />
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
              <FileText size={15} className="text-slate-600 dark:text-slate-400" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold">Payslip History</CardTitle>
              <CardDescription className="mt-0">{filtered.length} of {records.length} records</CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Year filter */}
            <div className="flex gap-1">
              {YEARS.map((y) => (
                <button
                  key={y}
                  onClick={() => { setYearFilter(y); setPage(1); }}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
                    yearFilter === y
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
                  )}
                >
                  {y}
                </button>
              ))}
            </div>

            {/* Status filter */}
            <div className="flex gap-1">
              {(["All", ...STATUSES] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(1); }}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium transition-all border",
                    statusFilter === s
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:border-foreground"
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
                placeholder="Search month…"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-8 h-8 text-sm w-36"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
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
                <SortTh col="month"      label="Month"       />
                <SortTh col="gross"      label="Gross"       align="right" />
                <SortTh col="deductions" label="Deductions"  align="right" />
                <SortTh col="net"        label="Net Salary"  align="right" />
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    No payslips match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                paged.map((row) => (
                  <TableRow key={row.monthKey} className="group">
                    <TableCell className="font-semibold text-sm">{row.month}</TableCell>
                    <TableCell className="text-right tabular-nums text-sm">
                      {fmt(row.gross)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm text-red-600 dark:text-red-400">
                      -{fmt(row.deductions)}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-sm font-bold text-green-700 dark:text-green-400">
                      {fmt(row.net)}
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("border-0 text-xs", STATUS_CONFIG[row.status].className)}>
                        {row.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {row.status === "Paid" ? (
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                          aria-label={`Download ${row.month} payslip`}
                        >
                          <Download size={14} />
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-5 py-3">
            <p className="text-xs text-muted-foreground">
              Page {page} of {totalPages} · {filtered.length} records
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost" size="icon-sm"
                className="h-7 w-7"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={14} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    "h-7 w-7 rounded-md text-xs font-medium transition-all",
                    page === p
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {p}
                </button>
              ))}
              <Button
                variant="ghost" size="icon-sm"
                className="h-7 w-7"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
