import { z } from "zod"

import { authUserSchema } from "@/features/auth/session/model/auth-schemas"

// POST /auth/login — LoginRequest
const loginRequestSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().min(1),
})

// POST /auth/login — LoginResponse. Returns the user plus a token pair, same
// shape as RegisterResponse, so a plain sign-in populates `user` too (see
// session/model/auth-slice.ts / viewmodel/use-sign-in.ts).
const loginResponseSchema = authUserSchema.extend({
  accessToken: z.string(),
  refreshToken: z.string(),
})

type LoginRequest = z.infer<typeof loginRequestSchema>
type LoginResponse = z.infer<typeof loginResponseSchema>

export { loginRequestSchema, loginResponseSchema }
export type { LoginRequest, LoginResponse }
