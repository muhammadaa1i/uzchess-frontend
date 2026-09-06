"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { useCertificateVerify } from "@/features/courses/viewmodel/use-certificate-verify"
import { formatDate } from "@/lib/utils"

interface CertificateVerifyViewProps {
  code: string
}

// Public verification page for GET /certificates/{code}/verify — reached by
// whoever holds a printed certificate's code (e.g. via a QR code printed on
// it), not linked to from anywhere else in this feature (the download
// endpoint returns an opaque PDF, not the certificate's code — see
// certificate-api.ts).
function CertificateVerifyView({ code }: CertificateVerifyViewProps) {
  const t = useTranslations("Courses.certificateVerify")
  const { certificate, isLoading, isError, refetch } = useCertificateVerify(code)

  return (
    <div className="mx-auto flex max-w-[600px] flex-col gap-4 px-4 py-16">
      <h1 className="text-center text-2xl font-medium text-brand-white">{t("title")}</h1>

      {isLoading ? (
        <Skeleton className="h-40 w-full rounded-xl" />
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : !certificate ? (
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("notFound")}
        </div>
      ) : (
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
            <span className="text-sm font-medium text-brand-white">
              {formatDate(certificate.issuedAt)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export { CertificateVerifyView }
