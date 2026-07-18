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

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DocumentsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<DocCategory | "All">("All");

  const filtered = DOCUMENTS.filter((d) => {
    const matchCat = activeCategory === "All" || d.category === activeCategory;
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const verifiedCount = DOCUMENTS.filter((d) => d.status === "Verified").length;
  const pendingCount  = DOCUMENTS.filter((d) => d.status === "Pending").length;
  const rejectedCount = DOCUMENTS.filter((d) => d.status === "Rejected").length;

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage and track all your HR documents</p>
        </div>
        <Button className="gap-2 self-start sm:self-auto">
          <Upload size={15} /> Upload Document
        </Button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Documents", value: DOCUMENTS.length, icon: Layers,       color: "text-primary"        },
          { label: "Verified",        value: verifiedCount,    icon: CheckCircle2,  color: "text-green-600"      },
          { label: "Pending Review",  value: pendingCount,     icon: Clock,         color: "text-amber-600"      },
          { label: "Rejected",        value: rejectedCount,    icon: AlertCircle,   color: "text-red-600"        },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="rounded-lg bg-muted p-2">
                <Icon size={18} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Category grid */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <FolderOpen size={16} /> Document Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES_GRID.map(({ label, lastUpdated }) => {
              const meta  = CATEGORY_META[label];
              const Icon  = meta.icon;
              const count = DOCUMENTS.filter((d) => d.category === label).length;
              return (
                <button
                  key={label}
                  onClick={() => setActiveCategory(activeCategory === label ? "All" : label)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 text-center transition-all hover:shadow-sm",
                    activeCategory === label ? "border-primary bg-primary/5" : "border-border"
                  )}
                >
                  <div className={cn("rounded-lg p-2.5", meta.bg)}>
                    <Icon size={20} className={meta.color} />
                  </div>
                  <span className="text-xs font-medium leading-tight">{label}</span>
                  <span className="text-[11px] text-muted-foreground">{count} files</span>
                  {activeCategory === label && (
                    <span className="absolute top-2 right-2">
                      <Check size={12} className="text-primary" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Documents table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <CardTitle className="text-base flex items-center gap-2 flex-1">
              <HardDrive size={16} /> All Documents
              {activeCategory !== "All" && (
                <Badge variant="secondary" className="ml-1 text-xs">{activeCategory}</Badge>
              )}
            </CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Search documents…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs w-48"
                />
              </div>
              {activeCategory !== "All" && (
                <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={() => setActiveCategory("All")}>
                  <RefreshCw size={12} /> Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4">Document</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right pr-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-sm">
                    No documents found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((doc) => {
                  const status = STATUS_CONFIG[doc.status];
                  const StatusIcon = status.icon;
                  return (
                    <TableRow key={doc.id} className="group">
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-2.5">
                          <FileIcon type={doc.fileType} />
                          <span className="text-sm font-medium">{doc.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn("text-xs border-0", CAT_BADGE[doc.category])}>
                          {doc.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{doc.uploadedDate}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{doc.size}</TableCell>
                      <TableCell>
                        <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full", status.cls)}>
                          <StatusIcon size={11} />
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right pr-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal size={15} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                              <Eye size={13} /> View
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                              <Download size={13} /> Download
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer text-xs">
                              <Share2 size={13} /> Share
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer text-xs text-destructive focus:text-destructive">
                              <Trash2 size={13} /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Required documents checklist */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield size={16} /> Required Documents Checklist
            <Badge variant="secondary" className="ml-auto text-xs">
              {REQUIRED_DOCS.filter((d) => d.done).length}/{REQUIRED_DOCS.length} Complete
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {REQUIRED_DOCS.map((doc) => (
              <div
                key={doc.name}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-sm",
                  doc.done
                    ? "border-green-200 bg-green-50 dark:border-green-900/40 dark:bg-green-900/10"
                    : "border-amber-200 bg-amber-50 dark:border-amber-900/40 dark:bg-amber-900/10"
                )}
              >
                {doc.done
                  ? <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                  : <AlertCircle  size={15} className="text-amber-600 shrink-0" />
                }
                <span className={doc.done ? "text-green-800 dark:text-green-300" : "text-amber-800 dark:text-amber-300"}>
                  {doc.name}
                </span>
                {!doc.done && (
                  <Button variant="ghost" size="sm" className="ml-auto h-6 text-[11px] px-2 text-amber-700 hover:text-amber-900">
                    Upload <ChevronRight size={11} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
