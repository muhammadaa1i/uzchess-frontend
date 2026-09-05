import type { z } from "zod"

import { verifyCertificateResponseSchema } from "@/features/courses/model/certificate-schemas"
import { baseApi } from "@/lib/api/base-api"

const certificateApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /courses/{id}/certificate — CertificateController_download returns
    // a raw `application/pdf` body (see certificate.controller.ts), not a
    // JSON DTO — there's no zod schema to validate here, just a binary blob
    // handed back for the view to open/download via an object URL. Only the
    // success path is a PDF: the "not earned yet" 404 comes back as JSON
    // (see get-certificate.handler.ts's DoesNotExistException), so the
    // responseHandler must branch on `response.ok` — always calling
    // `.blob()` would wrap that JSON error body in a Blob, which RTK Query
    // then stores as `error.data`, producing non-serializable-value warnings
    // and losing the error message use-certificate.ts's `getCourseErrorMessage`
    // fallback relies on.
    downloadCertificate: builder.query<Blob, number>({
      query: (courseId) => ({
        url: `/courses/${courseId}/certificate`,
        responseHandler: async (response: Response) =>
          response.ok ? response.blob() : response.json(),
      }),
    }),
    verifyCertificate: builder.query<z.infer<typeof verifyCertificateResponseSchema>, string>({
      query: (code) => ({ url: `/certificates/${code}/verify` }),
      transformResponse: (response: unknown) => verifyCertificateResponseSchema.parse(response),
    }),
  }),
})

const { useDownloadCertificateQuery, useVerifyCertificateQuery } = certificateApi

export { certificateApi, useDownloadCertificateQuery, useVerifyCertificateQuery }
