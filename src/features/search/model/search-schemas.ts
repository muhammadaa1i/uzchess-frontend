import { z } from "zod"

// Unified shape the header's quick-search panel renders, regardless of
// which of the three backend list endpoints (news/courses/books) a result
// came from. There is no unified search endpoint on the backend (see
// search-mappers.ts) — each item is mapped client-side from that feature's
// own list-item schema (news-schemas.ts / course-schemas.ts / book-schemas.ts)
// into this shape, the same "define the shared row shape locally" pattern
// already used by @/components/shared/news-card's `NewsCardRow`.
const searchResultTypeSchema = z.enum(["news", "course", "book"])

const searchResultItemSchema = z.object({
  id: z.number(),
  type: searchResultTypeSchema,
  title: z.string(),
  imageUrl: z.string().nullable(),
  href: z.string(),
})

type SearchResultItem = z.infer<typeof searchResultItemSchema>
type SearchResultType = z.infer<typeof searchResultTypeSchema>

export { searchResultItemSchema, searchResultTypeSchema }
export type { SearchResultItem, SearchResultType }
