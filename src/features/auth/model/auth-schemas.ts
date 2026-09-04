import { z } from "zod"

// POST /auth/register — RegisterRequest (see /swagger/account-json). Mirrors
// the backend's class-validator constraints 1:1 (see
// ../backend/src/features/auth/user/commands/register/register.request.ts) —
// firstName/lastName/password only require non-empty + a max length, there's
// no server-side password strength rule to guess at.
const registerRequestSchema = z.object({
  firstName: z.string().trim().min(1).max(64),
  lastName: z.string().trim().min(1).max(64),
  email: z.string().trim().min(1).max(128).email(),
  password: z.string().min(1).max(32),
  confirmPassword: z.string().min(1),
})

// Shared user shape returned by RegisterResponse (LoginResponse does NOT
// include it — see loginResponseSchema below). `avatar` isn't actually part
// of RegisterResponse either (only GET /profile, out of this feature's
// scope, returns it) — kept optional/nullable here so the type is ready for
// whenever the Profile feature populates it, without the register flow
// having to fabricate a value.
const authUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  isEmailVerified: z.boolean(),
  avatar: z.string().nullable().optional(),
})

// POST /auth/register — RegisterResponse. Registration logs the user in
// immediately: the response is the user plus a token pair, no separate
// login step needed afterwards.
const registerResponseSchema = authUserSchema.extend({
  accessToken: z.string(),
  refreshToken: z.string(),
})

// POST /auth/login — LoginRequest
const loginRequestSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().min(1),
})

const tokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

// POST /auth/login — LoginResponse. Verified against the live
// /swagger/account-json spec: tokens only, no user fields — unlike
// RegisterResponse. See auth-slice.ts for how `user` state is (not)
// populated after a plain sign-in.
const loginResponseSchema = tokenPairSchema

// POST /auth/refresh — RefreshTokenRequest / RefreshTokenResponse
const refreshRequestSchema = z.object({
  refreshToken: z.string(),
})

const refreshResponseSchema = tokenPairSchema

// POST /auth/logout — LogoutResponse
const logoutResponseSchema = z.object({
  message: z.string(),
})

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

type AuthUser = z.infer<typeof authUserSchema>
type RegisterRequest = z.infer<typeof registerRequestSchema>
type RegisterResponse = z.infer<typeof registerResponseSchema>
type LoginRequest = z.infer<typeof loginRequestSchema>
type LoginResponse = z.infer<typeof loginResponseSchema>
type RefreshRequest = z.infer<typeof refreshRequestSchema>
type RefreshResponse = z.infer<typeof refreshResponseSchema>
type LogoutResponse = z.infer<typeof logoutResponseSchema>
type VerifyEmailResendResponse = z.infer<typeof verifyEmailResendResponseSchema>
type VerifyEmailConfirmRequest = z.infer<typeof verifyEmailConfirmRequestSchema>
type VerifyEmailConfirmResponse = z.infer<typeof verifyEmailConfirmResponseSchema>

export {
  authUserSchema,
  registerRequestSchema,
  registerResponseSchema,
  loginRequestSchema,
  loginResponseSchema,
  refreshRequestSchema,
  refreshResponseSchema,
  logoutResponseSchema,
  verifyEmailResendResponseSchema,
  verifyEmailConfirmRequestSchema,
  verifyEmailConfirmResponseSchema,
}
export type {
  AuthUser,
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutResponse,
  VerifyEmailResendResponse,
  VerifyEmailConfirmRequest,
  VerifyEmailConfirmResponse,
}
