"use client"

import { useTranslations } from "next-intl"

function LessonSignInRequired() {
  const t = useTranslations("Courses.lesson")

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-4 py-16 text-center">
      <p className="text-sm text-brand-secondary-low">{t("signInRequired")}</p>
    </div>
  )
}

export { LessonSignInRequired }
