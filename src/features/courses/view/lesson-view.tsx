"use client"

import { LockIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLesson } from "@/features/courses/viewmodel/use-lesson"
import { Link } from "@/lib/i18n/navigation"

// Loaded via next/dynamic (ssr:false), only mounted while
// `nextLessonLockedOpen` is true — see next-lesson-locked-modal.tsx.
const NextLessonLockedModal = dynamic(
  () =>
    import("@/features/courses/view/next-lesson-locked-modal").then(
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
    return (
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-sm text-brand-secondary-low">{t("signInRequired")}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 py-8">
        <Skeleton className="aspect-video w-full rounded-xl" />
        <Skeleton className="h-6 w-1/2 rounded-lg" />
      </div>
    )
  }

  if (isError || !lesson) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-4 py-16 text-center">
        <p className="text-sm text-brand-secondary-low">{t("notFound")}</p>
        <Button render={<Link href={`/courses/${courseId}`} />} nativeButton={false}>
          {t("backToCourse")}
        </Button>
      </div>
    )
  }

  if (lesson.locked) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-4 py-16 text-center">
        <LockIcon className="size-10 text-brand-secondary-low" />
        <h1 className="text-xl font-medium text-brand-white">{t("lockedTitle")}</h1>
        <p className="text-sm text-brand-secondary-low">{t("lockedDescription")}</p>
        <Button render={<Link href={`/courses/${courseId}`} />} nativeButton={false}>
          {t("lockedCta")}
        </Button>
      </div>
    )
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
