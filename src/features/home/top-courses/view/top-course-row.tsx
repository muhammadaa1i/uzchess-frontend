import { StarIcon } from "lucide-react"
import Image from "next/image"

import type { CourseSummary } from "@/features/home/top-courses/model/top-courses-schemas"
import { formatPrice } from "@/lib/utils"

interface TopCourseRowProps {
  course: CourseSummary
}

function TopCourseRow({ course }: TopCourseRowProps) {
  return (
    <article className="flex items-center gap-4 py-3">
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

export { TopCourseRow }
