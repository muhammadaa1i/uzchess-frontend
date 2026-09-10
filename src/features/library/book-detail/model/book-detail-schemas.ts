import { z } from "zod"

// GET /books/read/{id} — GetBooksByIdResponse (see /swagger/books). Shares
// the same base fields as book-catalog's `bookListItemSchema` (both come
// from the same backend `Book` entity) — duplicated here rather than
// imported from book-catalog per CLAUDE.md's code-splitting mandate (each
// feature's model layer is self-contained, reachable only through its own
// route). There's no separate detail-only field (no book/course "sections"
// analogue here — a book has no lesson structure).
const bookDetailSchema = z.object({
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

// GET /books/categories/read — GetCategoriesResponse. Own copy of
// book-catalog's identical schema, used here only to label the category
// badge on the detail page.
const bookCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
})

// `title` is free-text admin-entered content, drawn in practice from a
// small, stable set (e.g. "Strategiya") — translated via
// Library.categoryLabels in the message files, with a fallback to the raw
// value for anything outside that set.
function translateCategoryTitle(labels: Record<string, string>, title: string): string {
  return labels[title] ?? title
}

// GET /authors/read — GetAuthorsResponse. Own copy of book-catalog's
// identical schema, used here to render the author byline.
const bookAuthorSchema = z.object({
  id: z.number(),
  fullName: z.string(),
})

// GET /difficulty/read — GetDifficultiesResponse. Own copy of
// book-catalog's identical schema, used here only to label the difficulty
// badge on the detail page.
const bookDifficultySchema = z.object({
  id: z.number(),
  degree: z.string(),
  icon: z.string(),
})

// The admin-entered values are drawn from a small, stable set, translated
// via Library.difficultyLevels in the message files, with a fallback to the
// raw value for anything outside that set.
function translateDifficultyDegree(labels: Record<string, string>, degree: string): string {
  return labels[degree] ?? degree
}

// POST /cart/add/{id} — AddCartItemResponse.
const addCartItemResponseSchema = z.object({ bookId: z.number(), message: z.string() })

// GET /orders — GetOrdersResponse[], used to derive the "purchased" state
// on the detail page (per CLAUDE.md's Library to-do: "purchased states
// (cross-check against GET /orders)").
const orderItemSchema = z.object({
  bookId: z.number(),
  title: z.string(),
  cover: z.string(),
  price: z.number(),
})
const orderStatusSchema = z.enum(["processing", "delivered", "cancelled"])
const orderSchema = z.object({
  id: z.number(),
  status: orderStatusSchema,
  totalPrice: z.number(),
  createdAt: z.string(),
  items: z.array(orderItemSchema),
})

type BookDetail = z.infer<typeof bookDetailSchema>
type BookCategory = z.infer<typeof bookCategorySchema>
type BookAuthor = z.infer<typeof bookAuthorSchema>
type BookDifficulty = z.infer<typeof bookDifficultySchema>
type Order = z.infer<typeof orderSchema>

export {
  addCartItemResponseSchema,
  bookAuthorSchema,
  bookCategorySchema,
  bookDetailSchema,
  bookDifficultySchema,
  orderSchema,
  translateCategoryTitle,
  translateDifficultyDegree,
}
export type { BookAuthor, BookCategory, BookDetail, BookDifficulty, Order }
