"use client"

import { useTranslations } from "next-intl"

import { CourseReviewForm } from "@/features/courses/course-reviews/view/course-review-form"
import { CourseReviewGated } from "@/features/courses/course-reviews/view/course-review-gated"
import { CourseReviewsResults } from "@/features/courses/course-reviews/view/course-reviews-results"
import { useCourseReviews } from "@/features/courses/course-reviews/viewmodel/use-course-reviews"

interface CourseReviewsSectionProps {
  courseId: number
  canReview: boolean
}

function CourseReviewsSection({ courseId, canReview }: CourseReviewsSectionProps) {
  const t = useTranslations("Courses.reviews")
  const {
    reviews,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrevious,
    form,
    onSubmit,
    isSubmitting,
    formError,
    justSubmitted,
  } = useCourseReviews(courseId, canReview)

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-medium text-brand-white">{t("title")}</h2>

      {canReview ? (
        <CourseReviewForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
          formError={formError}
          justSubmitted={justSubmitted}
        />
      ) : (
        <CourseReviewGated />
      )}

      <CourseReviewsResults
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        reviews={reviews}
        page={page}
        totalPages={totalPages}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        onPageChange={setPage}
      />
    </section>
  )
}

export { CourseReviewsSection }
