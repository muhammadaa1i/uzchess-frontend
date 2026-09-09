"use client"

import { LockIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"

interface LessonLockedProps {
  courseId: number
}

function LessonLocked({ courseId }: LessonLockedProps) {
  const t = useTranslations("Courses.lesson")

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-4 px-4 py-16 text-center">
      <LockIcon className="size-10 text-brand-secondary-low" />
      <h1 className="text-xl font-medium text-brand-white">{t("lockedTitle")}</h1>
      <p className="text-sm text-brand-secondary-low">{t("lockedDescription")}</p>
      <Button render={<Link href={`/courses/${courseId}`} />} nativeButton={false}>
        {t("lockedCta")}
      </Button>
    </div>
  )
}

export { LessonLocked }
