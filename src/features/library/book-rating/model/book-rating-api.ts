import type { z } from "zod"

import {
  type createBookRatingRequestSchema,
  createBookRatingResponseSchema,
  deleteBookRatingResponseSchema,
} from "@/features/library/book-rating/model/book-rating-schemas"
import { baseApi } from "@/lib/api/base-api"

const bookRatingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    rateBook: builder.mutation<
      z.infer<typeof createBookRatingResponseSchema>,
      { bookId: number; body: z.infer<typeof createBookRatingRequestSchema> }
    >({
      query: ({ bookId, body }) => ({
        url: `/books/rate/${bookId}`,
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => createBookRatingResponseSchema.parse(response),
    }),
    removeBookRating: builder.mutation<z.infer<typeof deleteBookRatingResponseSchema>, number>({
      query: (bookId) => ({ url: `/books/rate/${bookId}`, method: "DELETE" }),
      transformResponse: (response: unknown) => deleteBookRatingResponseSchema.parse(response),
    }),
  }),
})

const { useRateBookMutation, useRemoveBookRatingMutation } = bookRatingApi

export { bookRatingApi, useRateBookMutation, useRemoveBookRatingMutation }
