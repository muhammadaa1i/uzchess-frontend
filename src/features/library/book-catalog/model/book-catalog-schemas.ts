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

// GET /books/read — GetBooksResponse, paginated via PaginatedGetBooksResponse
// (see /swagger/books). `authorIds` mirrors Courses' identically-named field
// but is actually rendered here (as an author byline). The category/author/
// difficulty/language *reference* schemas this list's ids resolve against
// live in the sibling book-catalog-reference-data slice, not here — see that
// slice's book-catalog-reference-data-schemas.ts.
const bookListItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  pageCount: z.number(),
  publishedYear: z.number(),
  categoryId: z.number(),
  difficultyId: z.number(),
  languageId: z.number(),
  authorIds: z.array(z.number()),
  averageRating: z.number(),
  ratingsCount: z.number(),
})

const paginatedBooksSchema = paginatedSchema(bookListItemSchema)

type BookListItem = z.infer<typeof bookListItemSchema>

export { bookListItemSchema, paginatedBooksSchema }
export type { BookListItem }
