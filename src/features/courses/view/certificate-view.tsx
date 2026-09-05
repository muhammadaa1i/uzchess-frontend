"use client"

import { useTranslations } from "next-intl"
import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCertificate } from "@/features/courses/viewmodel/use-certificate"
import { Link } from "@/lib/i18n/navigation"

interface CertificateViewProps {
  courseId: number
}

// The backend generates the actual certificate as a landscape, printable PDF
// server-side (see certificate.controller.ts / certificate-pdf.generator) —
// this view fetches that PDF as a blob and hands it to the browser's native
// PDF viewer via an <iframe>, rather than re-implementing the certificate's
// layout in HTML/CSS. Loaded via next/dynamic (ssr:false) from this route's
// page.tsx per CLAUDE.md calling out "the certificate/print view" by name as
// a code-splitting candidate — blob/object-URL handling is browser-only
// anyway, so it couldn't render on the server.
function CertificateView({ courseId }: CertificateViewProps) {
  const t = useTranslations("Courses.certificate")
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { objectUrl, isLoading, isError, notEarnedYet, isAuthenticated } = useCertificate(courseId)

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-3 px-4 py-16 text-center">
        <h1 className="text-xl font-medium text-brand-white">{t("signInRequiredTitle")}</h1>
        <p className="text-sm text-brand-secondary-low">{t("signInRequiredDescription")}</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col gap-4 px-4 py-8">
        <Skeleton className="aspect-video w-full rounded-xl" />
      </div>
    )
  }

  if (notEarnedYet) {
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

  if (isError || !objectUrl) {
    return (
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-3 px-4 py-16 text-center">
        <p className="text-sm text-brand-secondary-low">{t("notEarnedYetDescription")}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-[1000px] flex-col gap-4 px-4 py-8">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>
        <p className="text-sm text-brand-secondary-low">{t("description")}</p>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-xl bg-white">
        <iframe ref={iframeRef} src={objectUrl} title={t("title")} className="size-full" />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <Button
          render={<a href={objectUrl} download={`certificate-${courseId}.pdf`} />}
          nativeButton={false}
        >
          {t("downloadCta")}
        </Button>
        <Button variant="outline" onClick={() => iframeRef.current?.contentWindow?.print()}>
          {t("printCta")}
        </Button>
      </div>
    </div>
  )
}

export { CertificateView }
