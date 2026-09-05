"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import type {
  CourseCategory,
  CourseDifficulty,
  CourseListItem,
} from "@/features/courses/model/course-schemas"
import { Link } from "@/lib/i18n/navigation"
import { formatPrice } from "@/lib/utils"

interface CourseCardProps {
  course: CourseListItem
  category?: CourseCategory
  difficulty?: CourseDifficulty
}

// Purely presentational catalog grid card — feature-local (not under
// @/components/shared) since it's only ever reached via the courses
// feature's own /courses route, matching CLAUDE.md's code-splitting mandate.
function CourseCard({ course, category, difficulty }: CourseCardProps) {
  const t = useTranslations("Courses.card")

  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex flex-col overflow-hidden rounded-xl bg-[#1A1D1F] transition-colors hover:bg-[#202426]"
    >
      <div className="relative aspect-video w-full bg-dark-2">
        <Image src={course.cover} alt={course.title} fill className="object-cover" />
        {difficulty && (
          <span className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-dark/80 px-2 py-1 text-xs font-medium text-brand-white backdrop-blur-sm">
            <Image src={difficulty.icon} alt="" width={14} height={14} className="rounded-full" />
            {difficulty.degree}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        {category && <span className="text-xs text-brand-secondary-low">{category.title}</span>}
        <h3 className="line-clamp-2 text-sm font-medium text-brand-white">{course.title}</h3>
        <div className="flex items-center gap-1 text-xs text-brand-secondary-low">
          <StarIcon className="size-3.5 fill-brand-yellow text-brand-yellow" />
          {course.averageRating.toFixed(1)} ({course.ratingsCount})
        </div>
        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
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
          <span className="text-xs text-brand-secondary-low">
            {t("lessons", { count: course.lessonsCount })}
          </span>
        </div>
      </div>
    </Link>
  )
}

export { CourseCard }
