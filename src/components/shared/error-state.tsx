"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
  className?: string
}

function ErrorState({ message, onRetry, className }: ErrorStateProps) {
  const t = useTranslations("Common")

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-xl border border-dashed border-destructive/40 bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low",
        className
      )}
    >
      <p>{message ?? t("errorState")}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {t("retry")}
        </Button>
      )}
    </div>
  )
}

export { ErrorState }
export type { ErrorStateProps }
