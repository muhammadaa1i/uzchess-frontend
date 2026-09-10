import { z } from "zod"

import {
  addCartItemResponseSchema,
  bookAuthorSchema,
  bookCategorySchema,
  bookDetailSchema,
  bookDifficultySchema,
  orderSchema,
} from "@/features/library/book-detail/model/book-detail-schemas"
import { baseApi } from "@/lib/api/base-api"

// This feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate). The
// three lookup-list endpoints duplicate book-catalog's `getBookCategories`/
// `getBookDifficulties`/`getBookAuthors` against the same backend routes
// under distinct endpoint names — RTK Query endpoint names are global
// across every `injectEndpoints` call on one `baseApi`, so two features
// can't share a name, and importing book-catalog's hooks here would pull
// that feature's model file into this route's bundle. The duplicate network
// request is a deliberate, small tradeoff for keeping both features
// independently reachable only through their own routes.
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
    getBookDetailCategories: builder.query<z.infer<typeof bookCategorySchema>[], void>({
      query: () => ({ url: "/books/categories/read" }),
      transformResponse: (response: unknown) => z.array(bookCategorySchema).parse(response),
    }),
    getBookDetailDifficulties: builder.query<z.infer<typeof bookDifficultySchema>[], void>({
      query: () => ({ url: "/difficulty/read" }),
      transformResponse: (response: unknown) => z.array(bookDifficultySchema).parse(response),
    }),
    getBookDetailAuthors: builder.query<z.infer<typeof bookAuthorSchema>[], void>({
      query: () => ({ url: "/authors/read" }),
      transformResponse: (response: unknown) => z.array(bookAuthorSchema).parse(response),
    }),
  }),
})

const {
  useGetBookByIdQuery,
  useGetOrdersQuery,
  useAddToCartMutation,
  useGetBookDetailCategoriesQuery,
  useGetBookDetailDifficultiesQuery,
  useGetBookDetailAuthorsQuery,
} = bookDetailApi

export {
  bookDetailApi,
  useAddToCartMutation,
  useGetBookByIdQuery,
  useGetBookDetailAuthorsQuery,
  useGetBookDetailCategoriesQuery,
  useGetBookDetailDifficultiesQuery,
  useGetOrdersQuery,
}
