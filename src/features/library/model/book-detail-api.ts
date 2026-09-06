import { z } from "zod"

import {
  addCartItemResponseSchema,
  bookDetailSchema,
  orderSchema,
} from "@/features/library/model/book-schemas"
import { baseApi } from "@/lib/api/base-api"

const bookDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getBookById: builder.query<z.infer<typeof bookDetailSchema>, number>({
      query: (id) => ({ url: `/books/read/${id}` }),
      transformResponse: (response: unknown) => bookDetailSchema.parse(response),
    }),
    // GET /orders — authenticated; used to derive the "purchased" state on
    // the detail page (a book has no dedicated "purchased" endpoint the way
    // Courses does — see CLAUDE.md's Library to-do note). Callers should
    // `skip` this query when signed out rather than let it 401.
    getOrders: builder.query<z.infer<typeof orderSchema>[], void>({
      query: () => ({ url: "/orders" }),
      transformResponse: (response: unknown) => z.array(orderSchema).parse(response),
    }),
    // POST /cart/add/{id} — AddCartItemResponse. Takes no request body per
    // the live spec (quantity always starts at 1, adjustable later via
    // PATCH /cart/update/{id} on the Cart page — out of scope here).
    addToCart: builder.mutation<z.infer<typeof addCartItemResponseSchema>, number>({
      query: (bookId) => ({ url: `/cart/add/${bookId}`, method: "POST" }),
      transformResponse: (response: unknown) => addCartItemResponseSchema.parse(response),
    }),
  }),
})

const { useGetBookByIdQuery, useGetOrdersQuery, useAddToCartMutation } = bookDetailApi

export { bookDetailApi, useAddToCartMutation, useGetBookByIdQuery, useGetOrdersQuery }
