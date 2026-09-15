import { z } from "zod"

import { authUserSchema } from "@/features/auth/session/model/auth-schemas"

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

// POST /auth/register — RegisterResponse. Registration logs the user in
// immediately: the response is the user plus a token pair, no separate
// login step needed afterwards.
const registerResponseSchema = authUserSchema.extend({
  accessToken: z.string(),
  refreshToken: z.string(),
})

type RegisterRequest = z.infer<typeof registerRequestSchema>
type RegisterResponse = z.infer<typeof registerResponseSchema>

export { registerRequestSchema, registerResponseSchema }
export type { RegisterRequest, RegisterResponse }
