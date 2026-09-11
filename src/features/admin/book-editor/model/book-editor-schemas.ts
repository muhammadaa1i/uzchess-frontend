import { z } from "zod"

// The editable-book shape the create/edit form prefills from — a duplicate of
// the sibling book-list slice's `bookAdminItemSchema` (see
// book-list-schemas.ts's comment on why: sibling slices within the same
// domain reuse each other's View components directly, but never each other's
// model layer, same rule CLAUDE.md documents for course-detail vs.
// course-reviews/lessons). book-list-row.tsx/book-edit-button.tsx pass a
// `BookAdminItem` in as this type's structurally-identical `book` prop.
const bookEditorItemSchema = z.object({
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

// GET /books/categories/read — GetCategoriesResponse. Same reference-list
// shape as book-catalog-schemas.ts's bookCategorySchema, duplicated here per
// the code-splitting mandate — the create/edit form needs it as a read-only
// reference select, not to build the categories sub-catalog CRUD (explicitly
// out of scope, see CLAUDE.md's admin-panel deferred backlog).
const bookCategorySchema = z.object({
  id: z.number(),
  title: z.string(),
})

// GET /authors/read — GetAuthorsResponse.
const bookAuthorSchema = z.object({
  id: z.number(),
  fullName: z.string(),
})

// GET /difficulty/read — GetDifficultiesResponse.
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

type BookEditorItem = z.infer<typeof bookEditorItemSchema>
type BookCategory = z.infer<typeof bookCategorySchema>
type BookAuthor = z.infer<typeof bookAuthorSchema>
type BookDifficulty = z.infer<typeof bookDifficultySchema>
type BookLanguage = z.infer<typeof bookLanguageSchema>

export {
  bookAuthorSchema,
  bookCategorySchema,
  bookDifficultySchema,
  bookEditorItemSchema,
  bookLanguageSchema,
}
export type { BookAuthor, BookCategory, BookDifficulty, BookEditorItem, BookLanguage }
