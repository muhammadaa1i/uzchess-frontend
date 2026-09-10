"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"

interface CertificateNotEarnedProps {
  courseId: number
}

function CertificateNotEarned({ courseId }: CertificateNotEarnedProps) {
  const t = useTranslations("Courses.certificate")

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-3 px-4 py-16 text-center">
      <h1 className="text-xl font-medium text-brand-white">{t("notEarnedYetTitle")}</h1>
      <p className="text-sm text-brand-secondary-low">{t("notEarnedYetDescription")}</p>
      <Button render={<Link href={`/courses/${courseId}`} />} nativeButton={false}>
        {t("backToCourse")}
      </Button>
    </div>
  )
}

export { CertificateNotEarned }
