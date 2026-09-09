import { z } from "zod"

// GET /books/top-rated — GetTopRatedBooksResponse (see /swagger/books).
const bookSummarySchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  discountPrice: z.number().nullable().optional(),
  cover: z.string(),
  description: z.string(),
  pageCount: z.number(),
  publishedYear: z.number(),
  averageRating: z.number(),
  ratingsCount: z.number(),
  purchasesCount: z.number(),
})

const booksResponseSchema = z.array(bookSummarySchema)

type BookSummary = z.infer<typeof bookSummarySchema>

export { bookSummarySchema, booksResponseSchema }
export type { BookSummary }
