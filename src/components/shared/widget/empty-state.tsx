import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

// Purely presentational empty-state placeholder, shared across every
// Home-page widget feature (game-of-day, top-ranking, latest-news,
// top-courses, top-books, completed-games) — same rationale as
// @/components/shared/widget/section-heading.
interface EmptyStateProps {
  message?: string
  className?: string
}

function EmptyState({ message, className }: EmptyStateProps) {
  const t = useTranslations("Common")

  return (
    <div
      className={cn(
        "rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low",
        className
      )}
    >
      {message ?? t("emptyState")}
    </div>
  )
}

export { EmptyState }
export type { EmptyStateProps }
