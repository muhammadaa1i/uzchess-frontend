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
// but is actually rendered here (as an author byline).
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

// GET /books/categories/read — GetCategoriesResponse (see /swagger/books).
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

// The admin-entered values are drawn from a small, stable set, translated
// via Library.difficultyLevels in the message files, with a fallback to the
// raw value for anything outside that set.
function translateDifficultyDegree(labels: Record<string, string>, degree: string): string {
  return labels[degree] ?? degree
}

// GET /languages/read — GetLanguagesResponse.
const bookLanguageSchema = z.object({
  id: z.number(),
  title: z.string(),
  code: z.string(),
})

type BookListItem = z.infer<typeof bookListItemSchema>
type BookCategory = z.infer<typeof bookCategorySchema>
type BookAuthor = z.infer<typeof bookAuthorSchema>
type BookDifficulty = z.infer<typeof bookDifficultySchema>
type BookLanguage = z.infer<typeof bookLanguageSchema>

export {
  bookAuthorSchema,
  bookCategorySchema,
  bookDifficultySchema,
  bookLanguageSchema,
  bookListItemSchema,
  paginatedBooksSchema,
  translateCategoryTitle,
  translateDifficultyDegree,
}
export type { BookAuthor, BookCategory, BookDifficulty, BookLanguage, BookListItem }
