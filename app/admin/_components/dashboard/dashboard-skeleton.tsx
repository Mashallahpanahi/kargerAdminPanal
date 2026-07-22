import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 rounded-xl lg:col-span-1" />
        <Skeleton className="h-80 rounded-xl lg:col-span-1" />
        <Skeleton className="h-80 rounded-xl lg:col-span-1" />
      </div>

      <Skeleton className="h-64 rounded-xl" />
    </div>
  );
}
