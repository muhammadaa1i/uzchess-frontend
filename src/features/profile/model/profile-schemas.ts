import { z } from "zod"

// GET /profile — GetProfileResponse (same shape as PATCH /profile's
// UpdateProfileResponse). The live OpenAPI doc marks avatar/email/birthDate
// as `type: object, nullable: true` (a Swagger-decorator quirk on the
// backend's DTO), but a real registered test account on the deployed
// backend returns plain strings — `email` always a string, `avatar`/
// `birthDate` nullable strings (`birthDate` as a full ISO datetime, e.g.
// "2000-01-15T00:00:00.000Z") — verified directly against the live API
// rather than trusting the OpenAPI shape as-is.
const profileSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  avatar: z.string().nullable(),
  email: z.string(),
  isEmailVerified: z.boolean(),
  birthDate: z.string().nullable(),
})

// PATCH /profile/password — ChangePasswordRequest/ChangePasswordResponse.
// This is the only "password reset" surface that exists on the backend —
// see CLAUDE.md's Auth section note on the missing forgot-password endpoint.
const changePasswordRequestSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmNewPassword: z.string(),
})
const changePasswordResponseSchema = z.object({ message: z.string() })

// PATCH /profile/email — ChangeEmailRequest/ChangeEmailResponse. Sends a
// 6-digit code to `newEmail`; the change isn't finalized until
// POST /profile/email/confirm below. No dedicated "resend" endpoint exists
// for this flow (unlike signup's /profile/verify-email/resend) — re-calling
// this same mutation with the same body is how the viewmodel resends.
const changeEmailRequestSchema = z.object({
  currentPassword: z.string(),
  newEmail: z.string(),
})
const changeEmailResponseSchema = z.object({ message: z.string(), email: z.string() })

// POST /profile/email/confirm — ConfirmEmailRequest/ConfirmEmailResponse.
// Same 6-digit-code shape as signup's verify-email confirm
// (see @/features/auth/model/auth-schemas.ts) but a separate endpoint/cache
// — this one finalizes an in-flight email *change*, not initial signup
// verification. Codes expire (backend throws a GoneException on confirm,
// same as the signup flow).
const confirmEmailRequestSchema = z.object({ code: z.string().length(6) })
const confirmEmailResponseSchema = z.object({ message: z.string(), email: z.string() })

type Profile = z.infer<typeof profileSchema>

export {
  changeEmailRequestSchema,
  changeEmailResponseSchema,
  changePasswordRequestSchema,
  changePasswordResponseSchema,
  confirmEmailRequestSchema,
  confirmEmailResponseSchema,
  profileSchema,
}
export type { Profile }
