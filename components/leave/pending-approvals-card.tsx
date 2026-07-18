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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { type LeaveRequest } from "@/lib/mock/leave-data";
import {
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Paperclip,
  Phone,
  User,
  CalendarDays,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PendingApprovalsCardProps {
  approvals: LeaveRequest[];
}

type LocalStatus = "Pending" | "Approved" | "Rejected";

function fmtDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const colors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-teal-100 text-teal-700",
    "bg-rose-100 text-rose-700",
    "bg-amber-100 text-amber-700",
  ];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold", color)}>
      {initials}
    </div>
  );
}

export function PendingApprovalsCard({ approvals }: PendingApprovalsCardProps) {
  const [statuses, setStatuses] = useState<Record<string, LocalStatus>>(
    Object.fromEntries(approvals.map((a) => [a.id, "Pending"]))
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = approvals.find((a) => a.id === selectedId) ?? null;

  function handleAction(id: string, action: "Approved" | "Rejected") {
    setStatuses((prev) => ({ ...prev, [id]: action }));
    setSelectedId(null);
  }

  const pendingCount = Object.values(statuses).filter((s) => s === "Pending").length;

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-900/20">
                <Clock size={15} className="text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">Pending Approvals</CardTitle>
                <CardDescription className="mt-0">Manager / HR review</CardDescription>
              </div>
            </div>
            {pendingCount > 0 && (
              <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white px-1.5">
                {pendingCount}
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2.5">
          {approvals.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No pending approvals.
            </p>
          ) : (
            approvals.map((req) => {
              const status = statuses[req.id];
              return (
                <div
                  key={req.id}
                  className={cn(
                    "group flex items-start gap-3 rounded-xl border p-3.5 transition-all",
                    status === "Approved" && "border-green-200 bg-green-50/50 dark:border-green-900 dark:bg-green-900/10",
                    status === "Rejected" && "border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-900/10",
                    status === "Pending"  && "border-border bg-card hover:border-amber-200 dark:hover:border-amber-800"
                  )}
                >
                  <AvatarInitials name={req.employeeName} />

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{req.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{req.department}</p>
                      </div>
                      <Badge
                        className={cn(
                          "border-0 text-xs shrink-0",
                          status === "Approved" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          status === "Rejected" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                          "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        )}
                      >
                        {status}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                      <span className="font-medium text-foreground">{req.leaveType}</span>
                      <span>·</span>
                      <span>{req.days} day{req.days > 1 ? "s" : ""}</span>
                      <span>·</span>
                      <span>{fmtDate(req.startDate)}{req.days > 1 ? ` – ${fmtDate(req.endDate)}` : ""}</span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1">{req.reason}</p>

                    {/* Action buttons */}
                    {status === "Pending" && (
                      <div className="flex gap-2 pt-1.5">
                        <Button
                          size="sm"
                          className="h-7 text-xs gap-1 bg-green-600 hover:bg-green-700 text-white rounded-lg flex-1"
                          onClick={() => handleAction(req.id, "Approved")}
                        >
                          <CheckCircle2 size={12} />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs gap-1 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex-1"
                          onClick={() => handleAction(req.id, "Rejected")}
                        >
                          <XCircle size={12} />
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs gap-1 rounded-lg"
                          onClick={() => setSelectedId(req.id)}
                        >
                          <ChevronRight size={12} />
                        </Button>
                      </div>
                    )}

                    {status !== "Pending" && (
                      <p className="text-xs text-muted-foreground pt-0.5">
                        {status === "Approved" ? "✓ You approved this request." : "✗ You rejected this request."}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Detail sheet */}
      <Sheet open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader className="pb-4 border-b border-border">
                <SheetTitle className="flex items-center gap-2">
                  <FileText size={16} />
                  Leave Request — {selected.id}
                </SheetTitle>
                <SheetDescription>
                  Applied on {fmtDate(selected.appliedDate)}
                </SheetDescription>
              </SheetHeader>

              <div className="py-5 space-y-5">
                {/* Employee */}
                <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                  <AvatarInitials name={selected.employeeName} />
                  <div>
                    <p className="font-semibold">{selected.employeeName}</p>
                    <p className="text-xs text-muted-foreground">{selected.department}</p>
                  </div>
                </div>

                {/* Leave details */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Leave Type", value: selected.leaveType, icon: CalendarDays },
                    { label: "Duration",   value: `${selected.days} day${selected.days > 1 ? "s" : ""}`, icon: Clock },
                    { label: "Start Date", value: fmtDate(selected.startDate), icon: CalendarDays },
                    { label: "End Date",   value: fmtDate(selected.endDate),   icon: CalendarDays },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-xl bg-muted/50 p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Icon size={12} />
                        {label}
                      </div>
                      <p className="text-sm font-semibold">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Reason</p>
                  <div className="rounded-xl border border-border bg-muted/30 p-3 text-sm">
                    {selected.reason}
                  </div>
                </div>

                {/* Attachment */}
                {selected.attachmentName && (
                  <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 p-3">
                    <Paperclip size={14} className="text-muted-foreground shrink-0" />
                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">{selected.attachmentName}</span>
                  </div>
                )}

                {/* Emergency contact */}
                {selected.emergencyContact && (
                  <div className="flex items-center gap-2 rounded-xl border border-border p-3">
                    <Phone size={14} className="text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Emergency Contact</p>
                      <p className="text-sm font-medium">{selected.emergencyContact}</p>
                    </div>
                  </div>
                )}
              </div>

              {statuses[selected.id] === "Pending" && (
                <SheetFooter className="border-t border-border pt-4">
                  <Button
                    className="flex-1 gap-1.5 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleAction(selected.id, "Approved")}
                  >
                    <CheckCircle2 size={15} />
                    Approve Request
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-1.5 border-red-200 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => handleAction(selected.id, "Rejected")}
                  >
                    <XCircle size={15} />
                    Reject Request
                  </Button>
                </SheetFooter>
              )}
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
