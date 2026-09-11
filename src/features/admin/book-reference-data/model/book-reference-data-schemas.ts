import { z } from "zod"

// GET /books/categories/read — GetCategoriesResponse. Same reference-list
// shape as book-catalog-schemas.ts's bookCategorySchema, duplicated here per
// CLAUDE.md's code-splitting mandate — this slice only feeds the book-editor
// create/edit form's read-only reference selects, not a categories sub-catalog
// CRUD (explicitly out of scope, see CLAUDE.md's admin-panel deferred
// backlog).
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

type BookCategory = z.infer<typeof bookCategorySchema>
type BookAuthor = z.infer<typeof bookAuthorSchema>
type BookDifficulty = z.infer<typeof bookDifficultySchema>
type BookLanguage = z.infer<typeof bookLanguageSchema>

export { bookAuthorSchema, bookCategorySchema, bookDifficultySchema, bookLanguageSchema }
export type { BookAuthor, BookCategory, BookDifficulty, BookLanguage }
