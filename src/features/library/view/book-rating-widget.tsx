"use client"

import { StarIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { useBookRating } from "@/features/library/viewmodel/use-book-rating"
import { cn } from "@/lib/utils"

interface BookRatingWidgetProps {
  bookId: number
  isAuthenticated: boolean
}

// No GET /books/reviews/{id}-style endpoint exists in the live spec (see
// book-schemas.ts) — this can only submit/withdraw the signed-in user's own
// score against POST/DELETE /books/rate/{id}, it can't render a review
// feed the way CourseReviewsSection does. Flagged as a backend gap rather
// than guessed at.
function BookRatingWidget({ bookId, isAuthenticated }: BookRatingWidgetProps) {
  const t = useTranslations("Library.detail.rating")
  const { selectedScore, submitRating, clearRating, isSubmitting, error, justRated } =
    useBookRating(bookId)

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4 sm:max-w-xs">
      <p className="text-sm font-medium text-brand-white">{t("title")}</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            aria-label={String(value)}
            disabled={isSubmitting}
            onClick={() => submitRating(value)}
          >
            <StarIcon
              className={cn(
                "size-6 text-brand-secondary-low",
                selectedScore >= value && "fill-brand-yellow text-brand-yellow"
              )}
            />
          </button>
        ))}
      </div>
      {selectedScore > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start"
          disabled={isSubmitting}
          onClick={clearRating}
        >
          {t("remove")}
        </Button>
      )}
      {justRated && <p className="text-sm text-brand-green">{t("success")}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export { BookRatingWidget }
