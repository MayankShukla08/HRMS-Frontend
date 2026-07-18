"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText, FileImage, FileSpreadsheet, File, Upload, Download,
  Filter, Search, Eye, MoreHorizontal, CheckCircle2, Clock,
  XCircle, HardDrive, FolderOpen, Shield, Briefcase, GraduationCap,
  CreditCard, Scale, Layers, ChevronRight, Check, AlertCircle,
  Trash2, Share2, RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = "Verified" | "Pending" | "Rejected";
type DocCategory = "Identity" | "Employment" | "Finance" | "Certificates" | "Legal" | "Education";

interface DocRecord {
  id: string;
  name: string;
  category: DocCategory;
  uploadedDate: string;
  size: string;
  status: DocStatus;
  fileType: "pdf" | "image" | "sheet" | "other";
}

interface RequiredDoc {
  name: string;
  done: boolean;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const DOCUMENTS: DocRecord[] = [
  { id: "1",  name: "Aadhaar Card.pdf",          category: "Identity",     uploadedDate: "12 Jan 2026", size: "1.2 MB",  status: "Pending",  fileType: "pdf"   },
  { id: "2",  name: "PAN Card.pdf",               category: "Identity",     uploadedDate: "12 Jan 2026", size: "0.8 MB",  status: "Verified", fileType: "pdf"   },
  { id: "3",  name: "Offer Letter.pdf",           category: "Employment",   uploadedDate: "15 Mar 2022", size: "2.1 MB",  status: "Verified", fileType: "pdf"   },
  { id: "4",  name: "Salary Slip - May 2026.pdf", category: "Finance",      uploadedDate: "01 Jun 2026", size: "0.5 MB",  status: "Verified", fileType: "pdf"   },
  { id: "5",  name: "Degree Certificate.pdf",     category: "Certificates", uploadedDate: "20 Apr 2022", size: "3.4 MB",  status: "Verified", fileType: "pdf"   },
  { id: "6",  name: "Address Proof.jpg",          category: "Identity",     uploadedDate: "10 Feb 2026", size: "2.7 MB",  status: "Rejected", fileType: "image" },
  { id: "7",  name: "Appointment Letter.pdf",     category: "Employment",   uploadedDate: "15 Mar 2022", size: "1.8 MB",  status: "Verified", fileType: "pdf"   },
  { id: "8",  name: "Form 16 FY2025-26.pdf",      category: "Finance",      uploadedDate: "15 Jun 2026", size: "4.2 MB",  status: "Pending",  fileType: "pdf"   },
  { id: "9",  name: "Non-Disclosure Agreement",   category: "Legal",        uploadedDate: "16 Mar 2022", size: "0.9 MB",  status: "Verified", fileType: "pdf"   },
  { id: "10", name: "Bank Passbook.pdf",          category: "Finance",      uploadedDate: "05 Jan 2026", size: "1.1 MB",  status: "Pending",  fileType: "pdf"   },
  { id: "11", name: "10th Marksheet.pdf",         category: "Education",    uploadedDate: "20 Apr 2022", size: "2.3 MB",  status: "Verified", fileType: "pdf"   },
  { id: "12", name: "Experience Letter.pdf",      category: "Employment",   uploadedDate: "14 Mar 2022", size: "1.4 MB",  status: "Verified", fileType: "pdf"   },
];

const REQUIRED_DOCS: RequiredDoc[] = [
  { name: "Aadhaar Card",       done: false },
  { name: "PAN Card",           done: true  },
  { name: "Offer Letter",       done: true  },
  { name: "Address Proof",      done: false },
  { name: "Degree Certificate", done: true  },
  { name: "Bank Passbook",      done: false },
];

const RECENT_UPLOADS = DOCUMENTS.slice(0, 5);

const CATEGORY_META: Record<DocCategory, { icon: React.ElementType; color: string; bg: string }> = {
  Identity:     { icon: Shield,        color: "text-blue-600",   bg: "bg-blue-50 dark:bg-blue-900/20"   },
  Employment:   { icon: Briefcase,     color: "text-violet-600", bg: "bg-violet-50 dark:bg-violet-900/20" },
  Education:    { icon: GraduationCap, color: "text-teal-600",   bg: "bg-teal-50 dark:bg-teal-900/20"   },
  Finance:      { icon: CreditCard,    color: "text-green-600",  bg: "bg-green-50 dark:bg-green-900/20" },
  Legal:        { icon: Scale,         color: "text-amber-600",  bg: "bg-amber-50 dark:bg-amber-900/20" },
  Certificates: { icon: GraduationCap, color: "text-rose-600",   bg: "bg-rose-50 dark:bg-rose-900/20"   },
};

const STATUS_CONFIG: Record<DocStatus, { label: string; icon: React.ElementType; cls: string }> = {
  Verified: { label: "Verified", icon: CheckCircle2, cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  Pending:  { label: "Pending",  icon: Clock,        cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  Rejected: { label: "Rejected", icon: XCircle,      cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"         },
};

const CAT_BADGE: Record<DocCategory, string> = {
  Identity:     "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Employment:   "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  Finance:      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  Certificates: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  Legal:        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  Education:    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
};

function FileIcon({ type, cls }: { type: DocRecord["fileType"]; cls?: string }) {
  const base = cn("shrink-0", cls);
  if (type === "image")  return <FileImage size={18} className={cn(base, "text-rose-500")} />;
  if (type === "sheet")  return <FileSpreadsheet size={18} className={cn(base, "text-green-600")} />;
  if (type === "pdf")    return <FileText size={18} className={cn(base, "text-red-500")} />;
  return <File size={18} className={cn(base, "text-muted-foreground")} />;
}

const CATEGORIES_GRID: { label: DocCategory; lastUpdated: string }[] = [
  { label: "Identity",     lastUpdated: "12 Jan 2026" },
  { label: "Employment",   lastUpdated: "01 Jun 2026" },
  { label: "Education",    lastUpdated: "20 Apr 2022" },
  { label: "Finance",      lastUpdated: "15 Jun 2026" },
  { label: "Legal",        lastUpdated: "16 Mar 2022" },
  { label: "Certificates", lastUpdated: "20 Apr 2022" },
];
