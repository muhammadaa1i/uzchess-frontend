"use client"

import { StarIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

const RATING_OPTIONS = [5, 4, 3, 2, 1]

interface RatingStarFilterProps {
  value: string
  anyRating: string
  onChange: (value: string) => void
}

// Figma shows the rating filter as 5 literal stars rather than a text
// dropdown — clicking star N sets `minRating` to N, clicking the
// already-active star again toggles it back to the "any" sentinel, same
// semantics the old Select-based rating filter used.
function RatingStarFilter({ value, anyRating, onChange }: RatingStarFilterProps) {
  const t = useTranslations("Library.filters")
  const selected = value === anyRating ? 0 : Number(value)

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-[#232627] bg-[#15181A] px-4 py-4">
      {RATING_OPTIONS.slice()
        .reverse()
        .map((star) => (
          <button
            key={star}
            type="button"
            aria-pressed={star <= selected}
            aria-label={t("ratingAndUp", { stars: star })}
            onClick={() => onChange(star === selected ? anyRating : String(star))}
            className="p-0.5"
          >
            <StarIcon
              className={cn(
                "size-5 transition-colors",
                star <= selected
                  ? "fill-brand-accent text-brand-accent"
                  : "text-brand-secondary-low"
              )}
            />
          </button>
        ))}
    </div>
  )
}

export { RatingStarFilter }
