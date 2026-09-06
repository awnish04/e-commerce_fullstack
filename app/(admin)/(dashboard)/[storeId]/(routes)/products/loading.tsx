import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <div className="rounded-md border">
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
