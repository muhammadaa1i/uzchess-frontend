"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"
import type { LiveSidebarCourse } from "@/features/live/model/live-schemas"
import { useLiveSidebarCourses } from "@/features/live/viewmodel/use-live-sidebar-courses"
import { cn, formatPrice } from "@/lib/utils"

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
          <CourseRow key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

function CourseRow({ course }: { course: LiveSidebarCourse }) {
  return (
    <article className={cn("flex items-center gap-4 py-3")}>
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-dark-2">
        <Image src={course.cover} alt={course.title} fill sizes="80px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <h3 className="line-clamp-2 text-sm font-medium text-brand-white">{course.title}</h3>
        <div className="flex items-center gap-1 text-xs text-brand-secondary-low">
          <StarIcon className="size-3.5 fill-brand-yellow text-brand-yellow" />
          {course.averageRating.toFixed(1)} ({course.ratingsCount})
        </div>
        <div className="flex items-center gap-2">
          {course.discountPrice ? (
            <>
              <span className="text-sm font-semibold text-brand-white">
                {formatPrice(course.discountPrice)}
              </span>
              <span className="text-xs text-brand-secondary-low line-through">
                {formatPrice(course.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-brand-white">
              {formatPrice(course.price)}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

export { LiveSidebarCourses }
