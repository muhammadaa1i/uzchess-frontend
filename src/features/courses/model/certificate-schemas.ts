import { z } from "zod"

// GET /certificates/{code}/verify — VerifyCertificateResponse. Public
// endpoint, used by the standalone verification page (anyone holding a
// printed certificate's code can confirm it's genuine) — see
// certificate-verify.controller.ts in the backend, `@Public()`.
const verifyCertificateResponseSchema = z.object({
  studentName: z.string(),
  courseTitle: z.string(),
  issuedAt: z.string(),
})

type VerifyCertificateResult = z.infer<typeof verifyCertificateResponseSchema>

export { verifyCertificateResponseSchema }
export type { VerifyCertificateResult }
