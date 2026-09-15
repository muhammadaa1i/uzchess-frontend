import { z } from "zod"

// POST /profile/verify-email/resend — VerifyEmailResendResponse
const verifyEmailResendResponseSchema = z.object({
  message: z.string(),
  email: z.string(),
})

// POST /profile/verify-email/confirm — VerifyEmailConfirmRequest / Response.
// `code` is the 6-digit numeric OTP; codes expire (backend throws a
// GoneException on confirm) — surfaced as a normal RTK Query error, not a
// distinct schema shape.
const verifyEmailConfirmRequestSchema = z.object({
  code: z.string().length(6),
})

const verifyEmailConfirmResponseSchema = z.object({
  message: z.string(),
  email: z.string(),
})

type VerifyEmailResendResponse = z.infer<typeof verifyEmailResendResponseSchema>
type VerifyEmailConfirmRequest = z.infer<typeof verifyEmailConfirmRequestSchema>
type VerifyEmailConfirmResponse = z.infer<typeof verifyEmailConfirmResponseSchema>

export {
  verifyEmailResendResponseSchema,
  verifyEmailConfirmRequestSchema,
  verifyEmailConfirmResponseSchema,
}
export type {
  VerifyEmailResendResponse,
  VerifyEmailConfirmRequest,
  VerifyEmailConfirmResponse,
}
