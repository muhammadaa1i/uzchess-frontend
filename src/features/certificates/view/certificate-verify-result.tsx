"use client"

import { useTranslations } from "next-intl"

import type { VerifyCertificateResult } from "@/features/certificates/model/certificate-schemas"
import { formatDate } from "@/lib/utils"

interface CertificateVerifyResultProps {
  certificate: VerifyCertificateResult
}

function CertificateVerifyResult({ certificate }: CertificateVerifyResultProps) {
  const t = useTranslations("Courses.certificateVerify")

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-6">
      <div className="flex justify-between gap-4">
        <span className="text-sm text-brand-secondary-low">{t("student")}</span>
        <span className="text-sm font-medium text-brand-white">{certificate.studentName}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-sm text-brand-secondary-low">{t("course")}</span>
        <span className="text-sm font-medium text-brand-white">{certificate.courseTitle}</span>
      </div>
      <div className="flex justify-between gap-4">
        <span className="text-sm text-brand-secondary-low">{t("issuedAt")}</span>
        <span className="text-sm font-medium text-brand-white">{formatDate(certificate.issuedAt)}</span>
      </div>
    </div>
  )
}

export { CertificateVerifyResult }
