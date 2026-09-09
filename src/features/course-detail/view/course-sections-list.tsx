"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { CourseLessonRow } from "@/features/course-detail/view/course-lesson-row"
import type { DetailSectionRow } from "@/features/course-detail/viewmodel/use-course-detail"

interface CourseSectionsListProps {
  courseId: number
  sections: DetailSectionRow[]
}

// "Course content" accordion on the detail page — each row links straight
// into the lessons feature's lesson-viewing screen
// (/courses/[id]/lessons/[lessonId]) when unlocked, and is inert (lock icon,
// no href) otherwise.
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
                  <CourseLessonRow courseId={courseId} lesson={lesson} />
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export { CourseSectionsList }
