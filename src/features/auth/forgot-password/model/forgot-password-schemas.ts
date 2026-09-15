import { z } from "zod"

// POST /auth/forgot-password — ForgotPasswordRequest / ForgotPasswordResponse
// (see /swagger/account-json; endpoint is `@Public()` on the backend). The
// response message is deliberately generic regardless of whether the account
// exists — never use it to tell the user "no account found" (see
// CLAUDE.md's Auth section). Sends a 6-digit code, valid 5 minutes,
// rate-limited to one request per 60s per account plus a 5 req/min per-IP
// throttle (surfaced to callers as a normal RTK Query 429 error).
const forgotPasswordRequestSchema = z.object({
  email: z.string().trim().min(1).max(128).email(),
})

const forgotPasswordResponseSchema = z.object({
  message: z.string(),
})

// POST /auth/reset-password — ResetPasswordRequest / ResetPasswordResponse.
// `code` is the 6-digit code emailed by forgot-password; codes expire after
// 5 minutes (backend throws a GoneException, same shape as verify-email's
// OTP — see verify-email/model/verify-email-schemas.ts). A successful reset
// revokes all of the user's existing refresh tokens server-side, so callers
// must not try to keep the user signed in afterwards — see
// forgot-password/viewmodel/use-reset-password.ts.
const resetPasswordRequestSchema = z.object({
  email: z.string().trim().min(1).max(128).email(),
  code: z.string().min(1),
  newPassword: z.string().min(1).max(32),
  confirmNewPassword: z.string().min(1),
})

const resetPasswordResponseSchema = z.object({
  message: z.string(),
})

type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>
type ForgotPasswordResponse = z.infer<typeof forgotPasswordResponseSchema>
type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>
type ResetPasswordResponse = z.infer<typeof resetPasswordResponseSchema>

export {
  forgotPasswordRequestSchema,
  forgotPasswordResponseSchema,
  resetPasswordRequestSchema,
  resetPasswordResponseSchema,
}
export type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
}
