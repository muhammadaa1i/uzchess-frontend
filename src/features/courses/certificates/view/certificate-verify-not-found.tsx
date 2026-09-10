"use client"

import { useTranslations } from "next-intl"

function CertificateVerifyNotFound() {
  const t = useTranslations("Courses.certificateVerify")

  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
      {t("notFound")}
    </div>
  )
}

export { CertificateVerifyNotFound }
