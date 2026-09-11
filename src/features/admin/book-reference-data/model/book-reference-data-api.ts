import type { z } from "zod"

import {
  bookAuthorSchema,
  bookCategorySchema,
  bookDifficultySchema,
  bookLanguageSchema,
} from "@/features/admin/book-reference-data/model/book-reference-data-schemas"
import { baseApi } from "@/lib/api/base-api"

// Read-only reference-list endpoints (category/author/difficulty/language)
// that only ever back the sibling book-editor slice's create/edit form
// selects/checkbox-list — split into their own slice per CLAUDE.md's
// "self-contained data-fetching widget" feature-granularity convention,
// rather than living inside book-editor-api.ts alongside the actual
// create/update mutations. This feature does not add CRUD for these
// sub-catalogs themselves (explicitly out of scope, see CLAUDE.md's
// admin-panel deferred backlog) — all four routes are `@Public()` GETs on
// the backend, no admin gating needed here (book-editor's own
// create/update/delete mutations remain the admin-gated part).
const bookReferenceDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBookCategories: builder.query<z.infer<typeof bookCategorySchema>[], void>({
      query: () => ({ url: "/books/categories/read" }),
      transformResponse: (response: unknown) => bookCategorySchema.array().parse(response),
    }),
    getAdminBookAuthors: builder.query<z.infer<typeof bookAuthorSchema>[], void>({
      query: () => ({ url: "/authors/read" }),
      transformResponse: (response: unknown) => bookAuthorSchema.array().parse(response),
    }),
    getAdminBookDifficulties: builder.query<z.infer<typeof bookDifficultySchema>[], void>({
      query: () => ({ url: "/difficulty/read" }),
      transformResponse: (response: unknown) => bookDifficultySchema.array().parse(response),
    }),
    getAdminBookLanguages: builder.query<z.infer<typeof bookLanguageSchema>[], void>({
      query: () => ({ url: "/languages/read" }),
      transformResponse: (response: unknown) => bookLanguageSchema.array().parse(response),
    }),
  }),
})

const {
  useGetAdminBookCategoriesQuery,
  useGetAdminBookAuthorsQuery,
  useGetAdminBookDifficultiesQuery,
  useGetAdminBookLanguagesQuery,
} = bookReferenceDataApi

export {
  bookReferenceDataApi,
  useGetAdminBookAuthorsQuery,
  useGetAdminBookCategoriesQuery,
  useGetAdminBookDifficultiesQuery,
  useGetAdminBookLanguagesQuery,
}
