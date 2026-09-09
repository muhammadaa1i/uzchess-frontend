import { z } from "zod"

// GET /banners/read — GetBannersResponse (see /swagger/home). Duplicated
// from the Live feature's identical schema rather than imported — each
// feature's model layer is self-contained per CLAUDE.md's code-splitting
// mandate.
const bannerSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  linkUrl: z.string().nullable().optional(),
  badgeText: z.string().nullable().optional(),
  isActive: z.boolean(),
})

const bannersResponseSchema = z.array(bannerSchema)

type Banner = z.infer<typeof bannerSchema>

export { bannerSchema, bannersResponseSchema }
export type { Banner }
