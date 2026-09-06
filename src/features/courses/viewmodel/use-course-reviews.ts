import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"

import { getCourseErrorMessage } from "@/features/courses/model/course-error"
import {
  useGetCourseReviewsQuery,
  useRateCourseMutation,
} from "@/features/courses/model/course-review-api"
import {
  createReviewFormSchema,
  type ReviewFormValues,
} from "@/features/courses/model/course-review-form-schema"

const REVIEWS_PAGE_SIZE = 10

// `canReview` is computed by the caller (useCourseDetail's `isCompleted`) —
// this hook only owns the reviews list + the submission form, not the
// purchased/completed gating logic itself, keeping a single responsibility
// per CLAUDE.md's SOLID guidance.
function useCourseReviews(courseId: number, canReview: boolean) {
  const tValidation = useTranslations("Courses.reviews.validation")
  const tErrors = useTranslations("Courses.reviews.errors")
  const [page, setPage] = useState(1)
  const [formError, setFormError] = useState<string | null>(null)
  const [justSubmitted, setJustSubmitted] = useState(false)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCourseReviewsQuery(
    { courseId, page, size: REVIEWS_PAGE_SIZE },
    { skip: !Number.isFinite(courseId) }
  )
  const [rate, { isLoading: isSubmitting }] = useRateCourseMutation()

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(createReviewFormSchema(tValidation)),
    defaultValues: { score: 0, comment: "" },
  })

  async function onSubmit(values: ReviewFormValues) {
    setFormError(null)
    try {
      await rate({ courseId, body: values }).unwrap()
      form.reset({ score: 0, comment: "" })
      setJustSubmitted(true)
    } catch (error) {
      setFormError(getCourseErrorMessage(error, tErrors("generic")))
    }
  }

  return {
    reviews: data?.data ?? [],
    isLoading: isLoading || isFetching,
    isError,
    refetch,
    page,
    setPage,
    totalPages: data?.totalPages ?? 0,
    hasNext: data?.hasNext ?? false,
    hasPrevious: data?.hasPrevious ?? false,
    canReview,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isSubmitting,
    formError,
    justSubmitted,
  }
}

export { REVIEWS_PAGE_SIZE, useCourseReviews }
