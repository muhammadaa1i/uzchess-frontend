import { ErrorState } from "@/components/shared/error/error-state"

interface CourseDetailErrorProps {
  onRetry: () => void
}

function CourseDetailError({ onRetry }: CourseDetailErrorProps) {
  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <ErrorState onRetry={onRetry} />
    </div>
  )
}

export { CourseDetailError }
