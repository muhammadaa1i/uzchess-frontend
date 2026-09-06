import { useVerifyCertificateQuery } from "@/features/courses/model/certificate-api"

function useCertificateVerify(code: string) {
  const { data, isLoading, isError, refetch } = useVerifyCertificateQuery(code, { skip: !code })

  return {
    certificate: data,
    isLoading,
    isError,
    refetch,
  }
}

export { useCertificateVerify }
