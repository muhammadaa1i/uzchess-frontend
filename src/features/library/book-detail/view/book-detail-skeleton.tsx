import { Skeleton } from "@/components/ui/skeleton"

function BookDetailSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        <Skeleton className="aspect-[3/4] w-full rounded-xl" />
        <div className="flex flex-col gap-4">
          <Skeleton className="h-8 w-2/3 rounded-lg" />
          <div className="flex flex-col gap-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full rounded" />
            ))}
          </div>
          <Skeleton className="h-32 w-full max-w-xs rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export { BookDetailSkeleton }
