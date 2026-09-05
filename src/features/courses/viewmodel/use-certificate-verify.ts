import { useVerifyCertificateQuery } from "@/features/courses/model/certificate-api"

function useCertificateVerify(code: string) {
  const { data, isLoading, isError } = useVerifyCertificateQuery(code, { skip: !code })

  return {
    certificate: data,
    isLoading,
    isError: isError || !code,
  }
}

export { useCertificateVerify }
