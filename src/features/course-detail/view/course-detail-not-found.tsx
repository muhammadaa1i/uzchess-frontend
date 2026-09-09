"use client"

import { useTranslations } from "next-intl"

function CourseDetailNotFound() {
  const t = useTranslations("Courses")

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
        {t("notFound")}
      </div>
    </div>
  )
}

export { CourseDetailNotFound }
