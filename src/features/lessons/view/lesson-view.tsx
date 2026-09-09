"use client"

import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { LessonErrorState } from "@/features/lessons/view/lesson-error-state"
import { LessonLocked } from "@/features/lessons/view/lesson-locked"
import { LessonNotFound } from "@/features/lessons/view/lesson-not-found"
import { LessonSignInRequired } from "@/features/lessons/view/lesson-sign-in-required"
import { LessonSkeleton } from "@/features/lessons/view/lesson-skeleton"
import { useLesson } from "@/features/lessons/viewmodel/use-lesson"
import { Link } from "@/lib/i18n/navigation"

// Loaded via next/dynamic (ssr:false), only mounted while
// `nextLessonLockedOpen` is true — see next-lesson-locked-modal.tsx.
const NextLessonLockedModal = dynamic(
  () =>
    import("@/features/lessons/view/next-lesson-locked-modal").then(
      (mod) => mod.NextLessonLockedModal
    ),
  { ssr: false }
)

interface LessonViewProps {
  courseId: number
  lessonId: number
}

// The "tactics answering" screen from CLAUDE.md's to-do — reconciled with
// the backend, which only models a lesson as a video + duration with a
// binary complete/incomplete flag (no question/answer payload at all, see
// course-lessons.handler.ts). "Answering" here is a watch-gated completion:
// the Complete button stays disabled until a countdown matching the
// lesson's own duration elapses, then POSTs /courses/lessons/{id}/complete.
function LessonView({ courseId, lessonId }: LessonViewProps) {
  const t = useTranslations("Courses.lesson")
  const {
    lesson,
    isLoading,
    isError,
    refetch,
    isAuthenticated,
    countdown,
    canComplete,
    onComplete,
    onContinue,
    isSubmitting,
    errorMessage,
    nextLessonLockedOpen,
    onNextLessonLockedOpenChange,
  } = useLesson(courseId, lessonId)

  if (!isAuthenticated) {
    return <LessonSignInRequired />
  }

  if (isLoading) {
    return <LessonSkeleton />
  }

  if (isError) {
    return <LessonErrorState onRetry={refetch} />
  }

  if (!lesson) {
    return <LessonNotFound courseId={courseId} />
  }

  if (lesson.locked) {
    return <LessonLocked courseId={courseId} />
  }

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 py-8">
      <Link href={`/courses/${courseId}`} className="text-sm text-brand-blue-light">
        {t("backToCourse")}
      </Link>

      <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
        {lesson.video && (
          <video
            key={lesson.id}
            src={lesson.video}
            controls
            className="size-full"
            poster={lesson.thumbnail ?? undefined}
          />
        )}
      </div>

      <h1 className="text-xl font-medium text-brand-white">{lesson.title}</h1>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      {lesson.completed ? (
        <Button onClick={onContinue} disabled={isSubmitting} className="self-start">
          {t("continueCta")}
        </Button>
      ) : (
        <Button onClick={onComplete} disabled={!canComplete || isSubmitting} className="self-start">
          {canComplete ? t("completeCta") : t("countdown", { seconds: countdown })}
        </Button>
      )}

      {nextLessonLockedOpen && (
        <NextLessonLockedModal
          courseId={courseId}
          open={nextLessonLockedOpen}
          onOpenChange={onNextLessonLockedOpenChange}
        />
      )}
    </div>
  )
}

export { LessonView }
