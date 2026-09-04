"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Skeleton } from "@/components/ui/skeleton"
import type { CourseSummary } from "@/features/home/model/home-schemas"
import { EmptyState } from "@/features/home/view/empty-state"
import { SectionHeading } from "@/features/home/view/section-heading"
import { useTopCourses } from "@/features/home/viewmodel/use-top-courses"
import { cn, formatPrice } from "@/lib/utils"

// "Barchasi" links to the courses catalog (Figma to-do section 5), which
// doesn't exist yet — see SectionHeading's placeholder CTA.
function TopCoursesSection() {
  const t = useTranslations("Home.topCourses")
  const { courses, isLoading, isError } = useTopCourses()

  return (
    <section className="flex flex-col rounded-lg bg-[#1A1D1F] p-4">
      <SectionHeading title={t("title")} actionLabel={t("seeAll")} size="sm" />
      {isLoading ? (
        <div className="mt-4 flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : isError || courses.length === 0 ? (
        <EmptyState className="mt-4" message={t("empty")} />
      ) : (
        <div className="mt-2 flex flex-col divide-y divide-[#272B30]">
          {courses.map((course) => (
            <CourseRow key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}

function CourseRow({ course }: { course: CourseSummary }) {
  return (
    <article className={cn("flex items-center gap-4 py-3")}>
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-dark-2">
        <Image src={course.cover} alt={course.title} fill className="object-cover" />
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

export { TopCoursesSection }
