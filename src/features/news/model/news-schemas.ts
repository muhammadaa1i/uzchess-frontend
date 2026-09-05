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
// /swagger/home). Duplicated from home's identical schema rather than
// imported — each feature's model layer is self-contained per CLAUDE.md's
// code-splitting mandate (features may only be reached through their own
// route(s)).
const newsItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  imageUrl: z.string().nullable().optional(),
  publishedAt: z.string(),
})

const paginatedNewsSchema = paginatedSchema(newsItemSchema)

// GET /news/read/{id} — GetNewsByIdResponse. `content` is a plain-text
// column on the backend (see ../backend/src/features/home/entities/news/news.entity.ts,
// created via a plain `@IsString()` field) rather than sanitized HTML, so
// the view renders it as text, not markup. `relatedNews` reuses the list
// item shape. There's no comments field/endpoint on this response or
// anywhere in /swagger/home or /swagger/account — same documented backend
// gap as forgot-password, so no comment thread is built against it.
const newsDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  imageUrl: z.string().nullable().optional(),
  publishedAt: z.string(),
  viewsCount: z.number(),
  relatedNews: z.array(newsItemSchema),
})

type NewsItem = z.infer<typeof newsItemSchema>
type NewsDetail = z.infer<typeof newsDetailSchema>

export { newsDetailSchema, newsItemSchema, paginatedNewsSchema }
export type { NewsDetail, NewsItem }
