"use client"

import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"
import { LiveSidebarCourseRow } from "@/features/live/view/live-sidebar-course-row"
import { useLiveSidebarCourses } from "@/features/live/viewmodel/use-live-sidebar-courses"

// Same "top courses" list shape as Home's `TopCoursesSection`
// (../home/view/top-courses-section.tsx), duplicated per feature rather
// than shared per CLAUDE.md's code-splitting mandate — this is the
// "sidebar course cards" slot from the Figma "Live" frame.
function LiveSidebarCourses() {
  const t = useTranslations("Live.sidebarCourses")
  const { courses, isLoading, isError } = useLiveSidebarCourses()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 rounded-lg bg-[#1A1D1F] p-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError || courses.length === 0) return null

  return (
    <div className="flex flex-col rounded-lg bg-[#1A1D1F] p-4">
      <h2 className="text-lg font-medium text-brand-white">{t("title")}</h2>
      <div className="mt-2 flex flex-col divide-y divide-[#272B30]">
        {courses.map((course) => (
          <LiveSidebarCourseRow key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export { LiveSidebarCourses }
