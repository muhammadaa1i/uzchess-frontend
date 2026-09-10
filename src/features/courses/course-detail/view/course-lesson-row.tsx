"use client"

import { CheckCircle2Icon, LockIcon, PlayCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import type { DetailSectionRow } from "@/features/courses/course-detail/viewmodel/use-course-detail"
import { Link } from "@/lib/i18n/navigation"
import { cn, formatDuration } from "@/lib/utils"

interface CourseLessonRowProps {
  courseId: number
  lesson: DetailSectionRow["lessons"][number]
}

function CourseLessonRow({ courseId, lesson }: CourseLessonRowProps) {
  const t = useTranslations("Courses.detail")
  const content = (
    <>
      {lesson.completed ? (
        <CheckCircle2Icon className="size-4 shrink-0 text-brand-green" aria-label={t("completedAria")} />
      ) : lesson.locked ? (
        <LockIcon className="size-4 shrink-0 text-brand-secondary-low" aria-label={t("lockedAria")} />
      ) : (
        <PlayCircleIcon className="size-4 shrink-0 text-brand-blue-light" />
      )}
      <span className="min-w-0 flex-1 truncate text-sm text-brand-white">{lesson.title}</span>
      {lesson.isFree && (
        <span className="shrink-0 rounded-full bg-brand-green/10 px-2 py-0.5 text-xs text-brand-green">
          {t("freeBadge")}
        </span>
      )}
      <span className="shrink-0 text-xs text-brand-secondary-low">
        {formatDuration(lesson.duration)}
      </span>
    </>
  )

  if (lesson.locked) {
    return (
      <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 opacity-60">{content}</div>
    )
  }

  return (
    <Link
      href={`/courses/${courseId}/lessons/${lesson.id}`}
      className={cn(
        "flex items-center gap-2 rounded-lg px-2.5 py-2 transition-colors hover:bg-[#202426]"
      )}
    >
      {content}
    </Link>
  )
}

export { CourseLessonRow }
