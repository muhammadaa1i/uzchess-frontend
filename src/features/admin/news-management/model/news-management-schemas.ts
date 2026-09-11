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

// GET /news/read — GetNewsResponse/PaginatedGetNewsResponse (see
// /swagger/home-json). Duplicated from the public news feature's identical
// schema (src/features/news/model/news-schemas.ts) rather than imported —
// admin needs its own RTK Query endpoint injection, and each feature's model
// layer is self-contained per CLAUDE.md's code-splitting mandate.
const newsAdminItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  imageUrl: z.string().nullable().optional(),
  publishedAt: z.string(),
})

const paginatedNewsAdminSchema = paginatedSchema(newsAdminItemSchema)

// GET /news/read/{id} — GetNewsByIdResponse, but only used here (via this
// feature's own `getAdminNewsById`) to prefill the edit form's `content`
// field, which the list response above doesn't carry. POST /news/create and
// PATCH /news/update/{id} both return this same shape too
// (CreateNewsResponse/UpdateNewsResponse per the live spec), minus
// `viewsCount`/`relatedNews`, which only exist on GetNewsByIdResponse and
// aren't needed here.
const newsAdminDetailSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  content: z.string(),
  imageUrl: z.string().nullable().optional(),
  publishedAt: z.string(),
})

// DELETE /news/delete/{id} — DeleteNewsResponse.
const deleteNewsResponseSchema = z.object({ message: z.string() })

type NewsAdminItem = z.infer<typeof newsAdminItemSchema>
type NewsAdminDetail = z.infer<typeof newsAdminDetailSchema>

export {
  deleteNewsResponseSchema,
  newsAdminDetailSchema,
  newsAdminItemSchema,
  paginatedNewsAdminSchema,
}
export type { NewsAdminDetail, NewsAdminItem }
