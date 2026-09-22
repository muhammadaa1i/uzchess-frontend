import { type z } from "zod"

import { paginatedBooksSchema } from "@/features/library/book-catalog/model/book-catalog-schemas"
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

// Book-catalog feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from home's identically-shaped `getTopRatedBooks` endpoint (see
// ../top-books/model/top-books-api.ts) and book-detail's own duplicate
// lookup endpoints, since endpoints for one feature must not live in another
// feature's model file, even against the same backend route. The category/
// author/difficulty/language reference-list endpoints this feature used to
// also define here now live in the sibling book-catalog-reference-data
// slice, shared with book-catalog-filters — see that slice's
// book-catalog-reference-data-api.ts.
const bookCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBooks: builder.query<z.infer<typeof paginatedBooksSchema>, GetBooksParams | void>({
      query: (params) => ({ url: "/books/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedBooksSchema.parse(response),
    }),
  }),
})

const { useGetBooksQuery } = bookCatalogApi

export { bookCatalogApi, useGetBooksQuery }
export type { GetBooksParams }
