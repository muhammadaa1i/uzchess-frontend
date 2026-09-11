import { Skeleton } from "@/components/ui/skeleton"

// Matches book-list.tsx's row layout while GET /books/read is loading —
// shadcn Skeleton per CLAUDE.md's mandated loading-state pattern, never a
// bare spinner.
function BookListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  )
}

export { BookListSkeleton }
