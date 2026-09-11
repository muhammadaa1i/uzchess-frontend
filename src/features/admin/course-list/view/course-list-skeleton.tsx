import { Skeleton } from "@/components/ui/skeleton"

// Matches course-list.tsx's row layout while GET /courses/read is loading —
// shadcn Skeleton per CLAUDE.md's mandated loading-state pattern, never a
// bare spinner.
function CourseListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  )
}

export { CourseListSkeleton }
