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

// Shared by GetBooksResponse / GetBooksByIdResponse / GetTopRatedBooksResponse
// / GetCartItemsResponse / GetFavouritesResponse (see /swagger/books and
// /swagger/account) — all carry this same base shape, with a couple of
// endpoints tacking on one extra field (`purchasesCount`, `quantity`).
// `authorIds` mirrors Courses' identically-named field but is actually
// rendered here (as an author byline), unlike Courses which only carries it
// for shape-fidelity.
const bookBaseSchema = z.object({
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

// GET /books/read — GetBooksResponse, paginated via PaginatedGetBooksResponse.
const bookListItemSchema = bookBaseSchema
const paginatedBooksSchema = paginatedSchema(bookListItemSchema)

// GET /books/read/{id} — GetBooksByIdResponse. Same shape as the list item;
// there's no separate detail-only field (no book/course "sections" analogue
// here — a book has no lesson structure).
const bookDetailSchema = bookBaseSchema

// GET /books/categories/read — GetCategoriesResponse (see /swagger/books).
const bookCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
})

// GET /authors/read — GetAuthorsResponse.
const bookAuthorSchema = z.object({
  id: z.number(),
  fullName: z.string(),
})

// GET /difficulty/read — GetDifficultiesResponse. `degree` is a free-text
// admin-entered label (e.g. "Beginner"), same caveat as Courses' identical
// field — rendered as-is rather than mapped through a fixed union.
const bookDifficultySchema = z.object({
  id: z.number(),
  degree: z.string(),
  icon: z.string(),
})

// GET /languages/read — GetLanguagesResponse.
const bookLanguageSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
})

// POST /books/rate/{id} — CreateRatingRequest/CreateRatingResponse. No
// comment field (unlike Courses' rating, which also accepts one) and no
// GET /books/reviews/{id}-style list endpoint exists in the live spec — a
// book's rating widget can only submit/withdraw the current user's own
// score, it can't render a review feed. Flagged as a backend gap in the
// feature's to-do note (see book-error.ts's sibling comment in the detail
// viewmodel).
const createBookRatingRequestSchema = z.object({ score: z.number().min(1).max(5) })
const createBookRatingResponseSchema = z.object({
  bookId: z.number(),
  score: z.number(),
  averageRating: z.number(),
  ratingsCount: z.number(),
})
const deleteBookRatingResponseSchema = z.object({ message: z.string() })

// GET /cart/read — GetCartItemsResponse[]. Only used here to know whether a
// book is already in the cart (add-to-cart button state) — the cart page
// itself is Section 10 (Cart/Checkout), out of scope for this feature.
const cartItemSchema = bookBaseSchema.extend({ quantity: z.number() })

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

type BookListItem = z.infer<typeof bookListItemSchema>
type BookDetail = z.infer<typeof bookDetailSchema>
type BookCategory = z.infer<typeof bookCategorySchema>
type BookAuthor = z.infer<typeof bookAuthorSchema>
type BookDifficulty = z.infer<typeof bookDifficultySchema>
type BookLanguage = z.infer<typeof bookLanguageSchema>
type CartItem = z.infer<typeof cartItemSchema>
type Order = z.infer<typeof orderSchema>

export {
  addCartItemResponseSchema,
  bookAuthorSchema,
  bookCategorySchema,
  bookDetailSchema,
  bookDifficultySchema,
  bookLanguageSchema,
  bookListItemSchema,
  cartItemSchema,
  createBookRatingRequestSchema,
  createBookRatingResponseSchema,
  deleteBookRatingResponseSchema,
  orderSchema,
  paginatedBooksSchema,
  paginatedSchema,
}
export type {
  BookAuthor,
  BookCategory,
  BookDetail,
  BookDifficulty,
  BookLanguage,
  BookListItem,
  CartItem,
  Order,
}
