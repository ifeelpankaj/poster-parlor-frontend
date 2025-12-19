import { Skeleton } from "@/components/ui/skeleton";

export const LoadingSkeleton = ({ count = 12 }: { count?: number }) => (
  <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="group overflow-hidden">
        <Skeleton className="aspect-[3/4] w-full rounded-lg mb-3" />
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2 mb-2" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-14" />
        </div>
      </div>
    ))}
  </div>
);
