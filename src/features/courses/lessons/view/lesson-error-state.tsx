import { ErrorState } from "@/components/shared/error/error-state"

interface LessonErrorStateProps {
  onRetry: () => void
}

function LessonErrorState({ onRetry }: LessonErrorStateProps) {
  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-4 py-16 text-center">
      <ErrorState onRetry={onRetry} />
    </div>
  )
}

export { LessonErrorState }
