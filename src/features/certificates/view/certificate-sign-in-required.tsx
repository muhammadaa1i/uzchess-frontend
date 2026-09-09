"use client"

import { useTranslations } from "next-intl"

function CertificateSignInRequired() {
  const t = useTranslations("Courses.certificate")

  return (
    <div className="mx-auto flex max-w-[900px] flex-col items-center gap-3 px-4 py-16 text-center">
      <h1 className="text-xl font-medium text-brand-white">{t("signInRequiredTitle")}</h1>
      <p className="text-sm text-brand-secondary-low">{t("signInRequiredDescription")}</p>
    </div>
  )
}

export { CertificateSignInRequired }
