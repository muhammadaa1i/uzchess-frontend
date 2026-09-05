"use client"

import dynamic from "next/dynamic"

// Blob/object-URL handling only works in the browser, and CLAUDE.md calls
// out the certificate/print view by name as a next/dynamic candidate — so
// it's excluded from SSR entirely rather than just code-split. `ssr: false`
// requires a Client Component boundary, so that lives here instead of in
// the (Server Component) page.
const CertificateView = dynamic(
  () => import("@/features/courses/view/certificate-view").then((mod) => mod.CertificateView),
  { ssr: false }
)

interface CertificateViewLoaderProps {
  courseId: number
}

function CertificateViewLoader({ courseId }: CertificateViewLoaderProps) {
  return <CertificateView courseId={courseId} />
}

export { CertificateViewLoader }
