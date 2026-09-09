"use client"

import { useTranslations } from "next-intl"

import { EmptyState } from "@/components/shared/empty-state"
import { ErrorState } from "@/components/shared/error-state"
import { SectionHeading } from "@/components/shared/section-heading"
import { Skeleton } from "@/components/ui/skeleton"
import { TopCourseRow } from "@/features/top-courses/view/top-course-row"
import { useTopCourses } from "@/features/top-courses/viewmodel/use-top-courses"

// "Barchasi" links to the courses catalog (Figma to-do section 5), which
// doesn't exist yet — see SectionHeading's placeholder CTA.
function TopCoursesSection() {
  const t = useTranslations("Home.topCourses")
  const { courses, isLoading, isError, refetch } = useTopCourses()

  return (
    <section className="flex flex-col rounded-lg bg-[#1A1D1F] p-4">
      <SectionHeading title={t("title")} actionLabel={t("seeAll")} size="sm" />
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState className="mt-4" onRetry={refetch} />
      ) : courses.length === 0 ? (
        <EmptyState className="mt-4" message={t("empty")} />
      ) : (
        <div className="mt-2 flex flex-col divide-y divide-[#272B30]">
          {courses.map((course) => (
            <TopCourseRow key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}

export { TopCoursesSection }
