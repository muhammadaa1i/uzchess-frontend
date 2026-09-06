import { z } from "zod"

// Live `POST /contact/create` (verified against the local backend's
// `/swagger/home-json` — CLAUDE.md's snapshot claiming no contact endpoint
// exists is stale, see the contact feature's tester report) accepts only
// `{name, email, message}` — no phone field — and echoes it back with `id`/
// `createdAt`.
const createContactRequestSchema = z.object({
  name: z.string().trim().min(1).max(64),
  email: z.string().trim().min(1).max(128).email(),
  message: z.string().trim().min(1).max(2000),
})

const createContactResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  message: z.string(),
  createdAt: z.string(),
})

export { createContactRequestSchema, createContactResponseSchema }
