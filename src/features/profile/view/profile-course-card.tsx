"use client"

import { StarIcon } from "lucide-react"
import Image from "next/image"

import type { ProfileCourseItem } from "@/features/profile/model/profile-schemas"
import { Link } from "@/lib/i18n/navigation"
import { formatPrice } from "@/lib/utils"

interface ProfileCourseCardProps {
  course: ProfileCourseItem
}

// Purely presentational grid card for the purchased-courses/saved-courses
// lists — feature-local (not @/components/shared) since it's only ever
// reached via the profile feature's own /profile route, matching
// CLAUDE.md's code-splitting mandate. Deliberately not reused from Courses'
// own CourseCard for the same reason (each feature's view layer is
// self-contained).
function ProfileCourseCard({ course }: ProfileCourseCardProps) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="flex flex-col overflow-hidden rounded-xl bg-[#1A1D1F] transition-colors hover:bg-[#202426]"
    >
      <div className="relative aspect-[3/4] w-full bg-dark-2">
        <Image
          src={course.cover}
          alt={course.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-medium text-brand-white">{course.title}</h3>
        <div className="flex items-center gap-1 text-xs text-brand-secondary-low">
          <StarIcon className="size-3.5 fill-brand-yellow text-brand-yellow" />
          {course.averageRating.toFixed(1)} ({course.ratingsCount})
        </div>
        <div className="mt-auto flex items-center gap-2 pt-1">
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
    </Link>
  )
}

export { ProfileCourseCard }
