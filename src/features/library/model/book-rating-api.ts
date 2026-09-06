import type { z } from "zod"

import {
  type createBookRatingRequestSchema,
  createBookRatingResponseSchema,
  deleteBookRatingResponseSchema,
} from "@/features/library/model/book-schemas"
import { baseApi } from "@/lib/api/base-api"

// Split from book-detail-api.ts by concern (rating vs. detail fetch), same
// as Courses splitting course-review-api.ts out of course-detail-api.ts.
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
