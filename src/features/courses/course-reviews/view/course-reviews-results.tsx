"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import type { CourseReview } from "@/features/courses/course-reviews/model/course-review-schemas"
import { CourseReviewItem } from "@/features/courses/course-reviews/view/course-review-item"
import { CourseReviewsPagination } from "@/features/courses/course-reviews/view/course-reviews-pagination"

interface CourseReviewsResultsProps {
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  reviews: CourseReview[]
  page: number
  totalPages: number
  hasNext: boolean
  hasPrevious: boolean
  onPageChange: (page: number) => void
}

function CourseReviewsResults({
  isLoading,
  isError,
  onRetry,
  reviews,
  page,
  totalPages,
  hasNext,
  hasPrevious,
  onPageChange,
}: CourseReviewsResultsProps) {
  const t = useTranslations("Courses.reviews")

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-lg" />
        ))}
      </div>
    )
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} />
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
        {t("empty")}
      </div>
    )
  }

  return (
    <>
      <ul className="flex flex-col divide-y divide-[#272B30]">
        {reviews.map((review) => (
          <CourseReviewItem key={review.id} review={review} />
        ))}
      </ul>
      {totalPages > 1 && (
        <CourseReviewsPagination
          page={page}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={onPageChange}
        />
      )}
    </>
  )
}

export { CourseReviewsResults }
