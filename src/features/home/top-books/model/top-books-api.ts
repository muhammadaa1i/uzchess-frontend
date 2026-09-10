import type { z } from "zod"

import { booksResponseSchema } from "@/features/home/top-books/model/top-books-schemas"
import { baseApi } from "@/lib/api/base-api"

// Top-books feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate).
const topBooksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopRatedBooks: builder.query<z.infer<typeof booksResponseSchema>, void>({
      query: () => ({ url: "/books/top-rated" }),
      transformResponse: (response: unknown) => booksResponseSchema.parse(response),
    }),
  }),
})

const { useGetTopRatedBooksQuery } = topBooksApi

export { topBooksApi, useGetTopRatedBooksQuery }
