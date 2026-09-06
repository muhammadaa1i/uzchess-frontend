import { useEffect, useMemo } from "react"

import { useDownloadCertificateQuery } from "@/features/courses/model/certificate-api"
import { useAppSelector } from "@/lib/store/hooks"

// GET /courses/{id}/certificate returns a raw PDF body (see
// certificate-api.ts) — this turns the fetched Blob into an object URL the
// view can hand to an <iframe>/<a download> without loading the whole file
// into a data: URL. Revoked on unmount/refetch to avoid leaking blob: URLs.
function useCertificate(courseId: number) {
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)
  const {
    data: pdfBlob,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useDownloadCertificateQuery(courseId, {
    skip: !isAuthenticated || !Number.isFinite(courseId),
  })
  const objectUrl = useMemo(() => (pdfBlob ? URL.createObjectURL(pdfBlob) : null), [pdfBlob])

  useEffect(() => {
    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [objectUrl])

  // The backend throws a 404 (DoesNotExistException) when the certificate
  // hasn't been earned yet (course not fully completed) — surfaced as a
  // distinct "not earned yet" state rather than a generic error.
  const status = (error as { status?: number } | undefined)?.status
  const notEarnedYet = isError && status === 404

  return {
    objectUrl,
    isLoading: isLoading || isFetching,
    isError: isError && !notEarnedYet,
    notEarnedYet,
    isAuthenticated,
    refetch,
  }
}

export { useCertificate }
