"use client"

import { useTranslations } from "next-intl"

import { ErrorState } from "@/components/shared/error/error-state"
import { Skeleton } from "@/components/ui/skeleton"
import { CertificateVerifyNotFound } from "@/features/courses/certificates/view/certificate-verify-not-found"
import { CertificateVerifyResult } from "@/features/courses/certificates/view/certificate-verify-result"
import { useCertificateVerify } from "@/features/courses/certificates/viewmodel/use-certificate-verify"

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
        <CertificateVerifyNotFound />
      ) : (
        <CertificateVerifyResult certificate={certificate} />
      )}
    </div>
  )
}

export { CertificateVerifyView }
