import { cn } from "@/lib/utils/utils";
import type { LucideIcon } from "lucide-react";

type StatCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  trend?: string;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  trend,
}: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight tabular-nums">
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p className="text-xs font-medium text-emerald-600">{trend}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg",
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
