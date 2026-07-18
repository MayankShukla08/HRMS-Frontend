import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";

export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t border-border bg-background">
      <div className="px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Building2 size={13} />
          <span>
            © {year}{" "}
            <span className="font-medium text-foreground">PropVivo</span>{" "}
            — Human Resource Management System
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>v1.0.0</span>
          <Separator orientation="vertical" className="h-3" />
          <span>All rights reserved</span>
        </div>
      </div>
    </footer>
  );
}
