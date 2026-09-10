import { CertificateVerifyView } from "@/features/courses/certificates/view/certificate-verify-view"

interface CertificateVerifyPageProps {
  params: Promise<{ code: string }>
}

export default async function CertificateVerify({ params }: CertificateVerifyPageProps) {
  const { code } = await params

  return <CertificateVerifyView code={code} />
}
