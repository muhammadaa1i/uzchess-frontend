import { z } from "zod"

// Shared user shape returned by both RegisterResponse and LoginResponse (see
// register/model/register-schemas.ts, login/model/login-schemas.ts) —
// lives here since it's common to both flows, not owned by either one.
// `avatar` isn't actually part of either response (only GET /profile, out of
// this feature's scope, returns it) — kept optional/nullable here so the
// type is ready for whenever the Profile feature populates it, without the
// register/login flows having to fabricate a value.
const authUserSchema = z.object({
  id: z.number(),
  email: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  isEmailVerified: z.boolean(),
  avatar: z.string().nullable().optional(),
})

const tokenPairSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
})

// POST /auth/refresh — RefreshTokenRequest / RefreshTokenResponse. Not
// exposed via an injected endpoint (see base-api.ts's baseQueryWithReauth,
// which calls this internally via a raw fetchBaseQuery) — kept here purely
// to document the contract that call relies on.
const refreshRequestSchema = z.object({
  refreshToken: z.string(),
})

const refreshResponseSchema = tokenPairSchema

type AuthUser = z.infer<typeof authUserSchema>
type RefreshRequest = z.infer<typeof refreshRequestSchema>
type RefreshResponse = z.infer<typeof refreshResponseSchema>

export { authUserSchema, tokenPairSchema, refreshRequestSchema, refreshResponseSchema }
export type { AuthUser, RefreshRequest, RefreshResponse }
