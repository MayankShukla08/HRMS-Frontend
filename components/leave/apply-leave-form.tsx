"use client";

import { useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { type LeaveType, LEAVE_TYPES } from "@/lib/mock/leave-data";
import {
  CalendarDays,
  ChevronDown,
  Paperclip,
  X,
  Save,
  Send,
  Phone,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ApplyLeaveFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  leaveType: LeaveType | "";
  startDate: string;
  endDate: string;
  reason: string;
  emergencyContact: string;
  attachmentName: string;
}

const INITIAL: FormState = {
  leaveType: "",
  startDate: "",
  endDate: "",
  reason: "",
  emergencyContact: "",
  attachmentName: "",
};

function calcDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

type SubmitState = "idle" | "draft" | "submitted";

export function ApplyLeaveForm({ open, onOpenChange }: ApplyLeaveFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const fileRef = useRef<HTMLInputElement>(null);

  const days = calcDays(form.startDate, form.endDate);

  function set<K extends keyof FormState>(key: K, val: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.leaveType)   errs.leaveType  = "Please select a leave type.";
    if (!form.startDate)   errs.startDate  = "Start date is required.";
    if (!form.endDate)     errs.endDate    = "End date is required.";
    if (form.startDate && form.endDate && form.endDate < form.startDate)
      errs.endDate = "End date must be on or after start date.";
    if (!form.reason.trim())      errs.reason = "Please provide a reason.";
    if (form.reason.trim().length < 10) errs.reason = "Reason should be at least 10 characters.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    setSubmitState("submitted");
    setTimeout(() => {
      setSubmitState("idle");
      setForm(INITIAL);
      onOpenChange(false);
    }, 1800);
  }

  function handleDraft() {
    setSubmitState("draft");
    setTimeout(() => {
      setSubmitState("idle");
      onOpenChange(false);
    }, 1200);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) set("attachmentName", file.name);
  }

  const today = new Date().toISOString().split("T")[0];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto flex flex-col">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2">
            <CalendarDays size={17} className="text-primary" />
            Apply for Leave
          </SheetTitle>
          <SheetDescription>
            Fill in the details below. Working days are calculated automatically.
          </SheetDescription>
        </SheetHeader>

        {submitState === "submitted" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 size={32} className="text-green-600" />
            </div>
            <div>
              <p className="text-lg font-bold">Request Submitted!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your leave request has been sent to your manager for approval.
              </p>
            </div>
          </div>
        ) : submitState === "draft" ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
              <Save size={32} className="text-blue-600" />
            </div>
            <div>
              <p className="text-lg font-bold">Draft Saved</p>
              <p className="text-sm text-muted-foreground mt-1">
                Your leave application has been saved as a draft.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto py-5 space-y-5">

            {/* Leave Type */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Leave Type <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <select
                  value={form.leaveType}
                  onChange={(e) => set("leaveType", e.target.value as LeaveType)}
                  className={cn(
                    "h-9 w-full appearance-none rounded-4xl border bg-input/30 px-3 pr-8 text-sm outline-none transition-colors",
                    "focus:border-ring focus:ring-[3px] focus:ring-ring/50",
                    errors.leaveType ? "border-destructive" : "border-input"
                  )}
                >
                  <option value="">Select leave type…</option>
                  {LEAVE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
              {errors.leaveType && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle size={11} /> {errors.leaveType}
                </p>
              )}
            </div>

            {/* Date range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Start Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={form.startDate}
                  min={today}
                  onChange={(e) => set("startDate", e.target.value)}
                  className={cn(errors.startDate && "border-destructive")}
                />
                {errors.startDate && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.startDate}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  End Date <span className="text-destructive">*</span>
                </label>
                <Input
                  type="date"
                  value={form.endDate}
                  min={form.startDate || today}
                  onChange={(e) => set("endDate", e.target.value)}
                  className={cn(errors.endDate && "border-destructive")}
                />
                {errors.endDate && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.endDate}
                  </p>
                )}
              </div>
            </div>

            {/* Days calculated */}
            {days > 0 && (
              <div className="flex items-center gap-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 px-4 py-3">
                <CalendarDays size={15} className="text-blue-600 shrink-0" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>{days}</strong> working day{days > 1 ? "s" : ""} will be deducted.
                </span>
              </div>
            )}

            {/* Reason */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Reason <span className="text-destructive">*</span>
              </label>
              <textarea
                value={form.reason}
                onChange={(e) => set("reason", e.target.value)}
                rows={4}
                placeholder="Describe the reason for your leave request…"
                className={cn(
                  "w-full resize-none rounded-2xl border bg-input/30 px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground",
                  "focus:border-ring focus:ring-[3px] focus:ring-ring/50",
                  errors.reason ? "border-destructive" : "border-input"
                )}
              />
              <div className="flex items-center justify-between">
                {errors.reason ? (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle size={11} /> {errors.reason}
                  </p>
                ) : <span />}
                <span className={cn("text-xs", form.reason.length < 10 ? "text-muted-foreground" : "text-green-600")}>
                  {form.reason.length}/500
                </span>
              </div>
            </div>

            {/* Attachment */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Attachment</label>
              <input
                type="file"
                ref={fileRef}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                onChange={handleFileChange}
              />
              {form.attachmentName ? (
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/30 px-3 py-2">
                  <Paperclip size={14} className="text-muted-foreground shrink-0" />
                  <span className="text-sm flex-1 truncate">{form.attachmentName}</span>
                  <button onClick={() => set("attachmentName", "")} className="text-muted-foreground hover:text-destructive transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full rounded-xl border-2 border-dashed border-border bg-muted/20 hover:bg-muted/40 transition-colors py-4 flex flex-col items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  <Paperclip size={18} />
                  <span>Click to upload (PDF, JPG, PNG, DOC)</span>
                  <span className="text-xs">Max file size: 5 MB</span>
                </button>
              )}
            </div>

            {/* Emergency Contact */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Phone size={13} className="text-muted-foreground" />
                Emergency Contact
                <span className="text-xs text-muted-foreground font-normal">(optional)</span>
              </label>
              <Input
                type="tel"
                placeholder="+91 98765 43210"
                value={form.emergencyContact}
                onChange={(e) => set("emergencyContact", e.target.value)}
              />
            </div>

          </div>
        )}

        {submitState === "idle" && (
          <SheetFooter className="border-t border-border pt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 gap-1.5"
              onClick={handleDraft}
            >
              <Save size={15} />
              Save Draft
            </Button>
            <Button
              className="flex-1 gap-1.5 bg-primary hover:bg-primary/90"
              onClick={handleSubmit}
            >
              <Send size={15} />
              Submit Request
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
