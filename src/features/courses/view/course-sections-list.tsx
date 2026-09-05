"use client"

import { CheckCircle2Icon, LockIcon, PlayCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { DetailSectionRow } from "@/features/courses/viewmodel/use-course-detail"
import { Link } from "@/lib/i18n/navigation"
import { cn, formatDuration } from "@/lib/utils"

interface CourseSectionsListProps {
  courseId: number
  sections: DetailSectionRow[]
}

// "Course content" accordion on the detail page — each row links straight
// into the lesson-viewing screen (/courses/[id]/lessons/[lessonId]) when
// unlocked, and is inert (lock icon, no href) otherwise.
function CourseSectionsList({ courseId, sections }: CourseSectionsListProps) {
  return (
    <Accordion defaultValue={sections[0] ? [String(sections[0].id)] : []} multiple>
      {sections.map((section) => (
        <AccordionItem key={section.id} value={String(section.id)}>
          <AccordionTrigger className="text-brand-white">{section.title}</AccordionTrigger>
          <AccordionContent>
            <ul className="flex flex-col gap-1">
              {section.lessons.map((lesson) => (
                <li key={lesson.id}>
                  <LessonRow courseId={courseId} lesson={lesson} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

function LessonRow({
  courseId,
  lesson,
}: {
  courseId: number
  lesson: DetailSectionRow["lessons"][number]
}) {
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

export { CourseSectionsList }
