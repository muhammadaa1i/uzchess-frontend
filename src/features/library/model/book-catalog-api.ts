import { z } from "zod"

import {
  bookAuthorSchema,
  bookCategorySchema,
  bookDifficultySchema,
  bookLanguageSchema,
  paginatedBooksSchema,
} from "@/features/library/model/book-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetBooksParams {
  search?: string
  categoryId?: number
  difficultyId?: number
  languageId?: number
  minRating?: number
  page?: number
  size?: number
}

// Library feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from home's identically-shaped `getTopRatedBooks` endpoint in
// home-api.ts, since endpoints for one feature must not live in another
// feature's model file, even against the same backend route.
const bookCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<z.infer<typeof paginatedBooksSchema>, GetBooksParams | void>({
      query: (params) => ({ url: "/books/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedBooksSchema.parse(response),
    }),
    getBookCategories: builder.query<z.infer<typeof bookCategorySchema>[], void>({
      query: () => ({ url: "/books/categories/read" }),
      transformResponse: (response: unknown) => z.array(bookCategorySchema).parse(response),
    }),
    getBookAuthors: builder.query<z.infer<typeof bookAuthorSchema>[], void>({
      query: () => ({ url: "/authors/read" }),
      transformResponse: (response: unknown) => z.array(bookAuthorSchema).parse(response),
    }),
    getBookDifficulties: builder.query<z.infer<typeof bookDifficultySchema>[], void>({
      query: () => ({ url: "/difficulty/read" }),
      transformResponse: (response: unknown) => z.array(bookDifficultySchema).parse(response),
    }),
    getBookLanguages: builder.query<z.infer<typeof bookLanguageSchema>[], void>({
      query: () => ({ url: "/languages/read" }),
      transformResponse: (response: unknown) => z.array(bookLanguageSchema).parse(response),
    }),
  }),
})

const {
  useGetBooksQuery,
  useGetBookCategoriesQuery,
  useGetBookAuthorsQuery,
  useGetBookDifficultiesQuery,
  useGetBookLanguagesQuery,
} = bookCatalogApi

export {
  bookCatalogApi,
  useGetBookAuthorsQuery,
  useGetBookCategoriesQuery,
  useGetBookDifficultiesQuery,
  useGetBookLanguagesQuery,
  useGetBooksQuery,
}
export type { GetBooksParams }
