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
// (see /swagger/books-json). POST /books/create and PATCH /books/update/{id}
// (book-editor's own endpoints) both return this same shape minus
// averageRating/ratingsCount (CreateBookResponse/UpdateBookResponse per the
// live spec), but those two fields are optional here so one schema covers
// list rows and mutation responses alike, same "one schema, no separate
// detail shape" reasoning as banner-management-schemas.ts. Duplicated from
// the public book-catalog feature's identical schema
// (src/features/library/book-catalog/model/book-catalog-schemas.ts) rather
// than imported — admin needs its own RTK Query endpoint injection, and each
// feature's model layer is self-contained per CLAUDE.md's code-splitting
// mandate. book-editor duplicates the fields it needs again in its own
// model (book-editor-schemas.ts's `bookEditorItemSchema`) rather than
// importing this one — sibling slices within the same domain reuse each
// other's View components directly (see book-list-row.tsx importing
// book-editor's dialog), but never each other's model layer, same "duplicate
// per feature, don't import" rule CLAUDE.md documents for course-detail vs.
// course-reviews/lessons.
const bookAdminItemSchema = z.object({
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
  averageRating: z.number().optional(),
  ratingsCount: z.number().optional(),
})

const paginatedBooksAdminSchema = paginatedSchema(bookAdminItemSchema)

// DELETE /books/delete/{id} — DeleteBookResponse.
const deleteBookResponseSchema = z.object({ message: z.string() })

type BookAdminItem = z.infer<typeof bookAdminItemSchema>

export { bookAdminItemSchema, deleteBookResponseSchema, paginatedBooksAdminSchema }
export type { BookAdminItem }
