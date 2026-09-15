import { z } from "zod"

// POST /auth/logout — LogoutResponse
const logoutResponseSchema = z.object({
  message: z.string(),
})

type LogoutResponse = z.infer<typeof logoutResponseSchema>

export { logoutResponseSchema }
export type { LogoutResponse }
