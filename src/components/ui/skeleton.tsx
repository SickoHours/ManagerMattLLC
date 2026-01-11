import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50",
        className
      )}
    />
  );
}

// Specialized skeletons for common patterns
export function SkeletonText({ className, lines = 1 }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 && lines > 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonPrice({ className }: SkeletonProps) {
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-5 w-6" />
      <Skeleton className="h-10 w-20" />
    </div>
  );
}

export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-surface rounded-2xl p-6 space-y-4", className)}>
      <Skeleton className="h-6 w-1/3" />
      <SkeletonText lines={2} />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
      </div>
    </div>
  );
}

// Results page specific skeleton
export function ResultsSummarySkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md animate-pulse">
      {/* Price range */}
      <div className="text-center pb-6 border-b border-border-default">
        <Skeleton className="h-4 w-32 mx-auto mb-3" />
        <div className="flex items-baseline justify-center gap-2">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-5 w-6" />
          <Skeleton className="h-10 w-20" />
        </div>
        <Skeleton className="h-4 w-28 mx-auto mt-3" />
      </div>

      {/* Confidence and timeline */}
      <div className="grid grid-cols-2 gap-6 py-6 border-b border-border-default">
        <div className="text-center">
          <Skeleton className="h-3 w-20 mx-auto mb-2" />
          <Skeleton className="h-8 w-12 mx-auto" />
        </div>
        <div className="text-center">
          <Skeleton className="h-3 w-16 mx-auto mb-2" />
          <Skeleton className="h-8 w-24 mx-auto" />
        </div>
      </div>

      {/* Build spec */}
      <div className="pt-6 space-y-4">
        <Skeleton className="h-3 w-20" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <Skeleton className="h-3 w-12 mb-1" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
        <div className="pt-2">
          <Skeleton className="h-3 w-28 mb-2" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-7 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CostBreakdownSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-6 md:p-8 shadow-md animate-pulse">
      <Skeleton className="h-5 w-32 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
