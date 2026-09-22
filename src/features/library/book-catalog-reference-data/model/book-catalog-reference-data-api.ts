import { z } from "zod"

import {
  bookAuthorSchema,
  bookCategorySchema,
  bookDifficultySchema,
  bookLanguageSchema,
} from "@/features/library/book-catalog-reference-data/model/book-catalog-reference-data-schemas"
import { baseApi } from "@/lib/api/base-api"

// Read-only reference-list endpoints (category/author/difficulty/language)
// shared by the sibling book-catalog (results grid's id-to-label badges) and
// book-catalog-filters (sidebar/mobile filter selects) slices — split into
// their own slice per CLAUDE.md's "self-contained data-fetching widget"
// feature-granularity convention. Unlike book-detail's deliberate duplicate
// requests against these same routes (justified there because book-detail
// and book-catalog are never rendered on the same page), book-catalog and
// book-catalog-filters render together on one page load, so sharing one set
// of endpoints here lets both consumers hit the same RTK Query cache entry
// instead of firing two simultaneous, identical requests. Endpoint names are
// prefixed `BookCatalog...` since RTK Query endpoint names are global across
// every `injectEndpoints` call on one `baseApi`, and book-detail/admin
// already claim differently-prefixed names against these same routes.
const bookCatalogReferenceDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookCatalogCategories: builder.query<z.infer<typeof bookCategorySchema>[], void>({
      query: () => ({ url: "/books/categories/read" }),
      transformResponse: (response: unknown) => z.array(bookCategorySchema).parse(response),
    }),
    getBookCatalogAuthors: builder.query<z.infer<typeof bookAuthorSchema>[], void>({
      query: () => ({ url: "/authors/read" }),
      transformResponse: (response: unknown) => z.array(bookAuthorSchema).parse(response),
    }),
    getBookCatalogDifficulties: builder.query<z.infer<typeof bookDifficultySchema>[], void>({
      query: () => ({ url: "/difficulty/read" }),
      transformResponse: (response: unknown) => z.array(bookDifficultySchema).parse(response),
    }),
    getBookCatalogLanguages: builder.query<z.infer<typeof bookLanguageSchema>[], void>({
      query: () => ({ url: "/languages/read" }),
      transformResponse: (response: unknown) => z.array(bookLanguageSchema).parse(response),
    }),
  }),
})

const {
  useGetBookCatalogCategoriesQuery,
  useGetBookCatalogAuthorsQuery,
  useGetBookCatalogDifficultiesQuery,
  useGetBookCatalogLanguagesQuery,
} = bookCatalogReferenceDataApi

export {
  bookCatalogReferenceDataApi,
  useGetBookCatalogAuthorsQuery,
  useGetBookCatalogCategoriesQuery,
  useGetBookCatalogDifficultiesQuery,
  useGetBookCatalogLanguagesQuery,
}
