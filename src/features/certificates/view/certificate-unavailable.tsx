"use client"

import { useTranslations } from "next-intl"

function CertificateUnavailable() {
  const t = useTranslations("Courses.certificate")

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-3 px-4 py-16 text-center">
      <p className="text-sm text-brand-secondary-low">{t("notEarnedYetDescription")}</p>
    </div>
  )
}

export { CertificateUnavailable }
