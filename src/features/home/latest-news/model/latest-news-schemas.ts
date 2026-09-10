import { z } from "zod"

function paginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z.object({
    totalCount: z.number(),
    totalPages: z.number(),
    currentPage: z.number(),
    hasNext: z.boolean(),
    hasPrevious: z.boolean(),
    data: z.array(itemSchema),
  })
}

// GET /news/read — GetNewsResponse / PaginatedGetNewsResponse (see
// /swagger/home). Duplicated from the News feature's identical schema
// rather than imported — each feature's model layer is self-contained per
// CLAUDE.md's code-splitting mandate (features may only be reached through
// their own route(s)).
const newsItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  imageUrl: z.string().nullable().optional(),
  publishedAt: z.string(),
})

const paginatedNewsSchema = paginatedSchema(newsItemSchema)

type NewsItem = z.infer<typeof newsItemSchema>

export { newsItemSchema, paginatedNewsSchema }
export type { NewsItem }
