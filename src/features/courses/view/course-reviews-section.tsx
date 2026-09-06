"use client"

import { StarIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import type { MouseEvent } from "react"
import { Controller } from "react-hook-form"

import { ErrorState } from "@/components/shared/error-state"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { useCourseReviews } from "@/features/courses/viewmodel/use-course-reviews"
import { cn, formatDate } from "@/lib/utils"

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

  function goTo(nextPage: number) {
    return (event: MouseEvent) => {
      event.preventDefault()
      setPage(nextPage)
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-medium text-brand-white">{t("title")}</h2>

      {canReview ? (
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4"
        >
          <Controller
            control={form.control}
            name="score"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t("form.scoreLabel")}</FieldLabel>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={String(value)}
                      onClick={() => field.onChange(value)}
                    >
                      <StarIcon
                        className={cn(
                          "size-6 text-brand-secondary-low",
                          field.value >= value && "fill-brand-yellow text-brand-yellow"
                        )}
                      />
                    </button>
                  ))}
                </div>
                <FieldError errors={[form.formState.errors.score]} />
              </Field>
            )}
          />
          <Field>
            <FieldLabel htmlFor="review-comment">{t("form.commentLabel")}</FieldLabel>
            <Textarea
              id="review-comment"
              placeholder={t("form.commentPlaceholder")}
              {...form.register("comment")}
            />
            <FieldError errors={[form.formState.errors.comment]} />
          </Field>
          {formError && <p className="text-sm text-destructive">{formError}</p>}
          {justSubmitted && <p className="text-sm text-brand-green">{t("form.success")}</p>}
          <Button type="submit" disabled={isSubmitting} className="self-start">
            {t("form.submit")}
          </Button>
        </form>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-6 text-center">
          <p className="text-sm font-medium text-brand-white">{t("gated.title")}</p>
          <p className="mt-1 text-sm text-brand-secondary-low">{t("gated.description")}</p>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("empty")}
        </div>
      ) : (
        <>
          <ul className="flex flex-col divide-y divide-[#272B30]">
            {reviews.map((review) => (
              <li key={review.id} className="flex gap-3 py-4">
                <Avatar size="sm">
                  <AvatarFallback>{review.userFullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-brand-white">
                      {review.userFullName}
                    </span>
                    <span className="text-xs text-brand-secondary-low">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <StarIcon
                        key={value}
                        className={cn(
                          "size-3.5 text-brand-secondary-low",
                          review.score >= value && "fill-brand-yellow text-brand-yellow"
                        )}
                      />
                    ))}
                  </div>
                  {review.comment && (
                    <p className="text-sm text-brand-secondary-low">{review.comment}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    aria-disabled={!hasPrevious}
                    className={!hasPrevious ? "pointer-events-none opacity-50" : undefined}
                    onClick={goTo(page - 1)}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    aria-disabled={!hasNext}
                    className={!hasNext ? "pointer-events-none opacity-50" : undefined}
                    onClick={goTo(page + 1)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </section>
  )
}

export { CourseReviewsSection }
