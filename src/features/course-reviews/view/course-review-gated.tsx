"use client"

import { useTranslations } from "next-intl"

function CourseReviewGated() {
  const t = useTranslations("Courses.reviews")

  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-6 text-center">
      <p className="text-sm font-medium text-brand-white">{t("gated.title")}</p>
      <p className="mt-1 text-sm text-brand-secondary-low">{t("gated.description")}</p>
    </div>
  )
}

export { CourseReviewGated }
