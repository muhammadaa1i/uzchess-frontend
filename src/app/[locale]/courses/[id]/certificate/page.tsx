import { CertificateViewLoader } from "@/features/certificates/view/certificate-view-loader"

interface CertificatePageProps {
  params: Promise<{ id: string }>
}

export default async function Certificate({ params }: CertificatePageProps) {
  const { id } = await params

  return <CertificateViewLoader courseId={Number(id)} />
}
