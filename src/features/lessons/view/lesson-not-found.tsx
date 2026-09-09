"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"

interface LessonNotFoundProps {
  courseId: number
}

function LessonNotFound({ courseId }: LessonNotFoundProps) {
  const t = useTranslations("Courses.lesson")

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-4 py-16 text-center">
      <p className="text-sm text-brand-secondary-low">{t("notFound")}</p>
      <Button render={<Link href={`/courses/${courseId}`} />} nativeButton={false}>
        {t("backToCourse")}
      </Button>
    </div>
  )
}

export { LessonNotFound }
