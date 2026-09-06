import { z } from "zod"

import {
  cartItemSchema,
  cartSummarySchema,
  removeCartItemResponseSchema,
  updateCartItemQuantityResponseSchema,
} from "@/features/cart/model/cart-schemas"
import { baseApi } from "@/lib/api/base-api"

// Cart feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` — kept out of Library's `book-detail-api.ts` (which
// only owns `POST /cart/add/{id}` for the book-detail page's add-to-cart
// button) per CLAUDE.md's "no cross-feature endpoints" mandate, even though
// both touch the same `/cart/*` routes and Book entity shape.
const cartApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<z.infer<typeof cartItemSchema>[], void>({
      query: () => ({ url: "/cart/read" }),
      transformResponse: (response: unknown) => z.array(cartItemSchema).parse(response),
    }),
    // `code` is only sent once the user has typed a coupon and asked to
    // apply it — the initial page load fetches the summary with no code.
    getCartSummary: builder.query<z.infer<typeof cartSummarySchema>, { code?: string } | void>({
      query: (params) => ({ url: "/cart/summary", params: params?.code ? { code: params.code } : undefined }),
      transformResponse: (response: unknown) => cartSummarySchema.parse(response),
    }),
    updateCartItemQuantity: builder.mutation<
      z.infer<typeof updateCartItemQuantityResponseSchema>,
      { bookId: number; quantity: number }
    >({
      query: ({ bookId, quantity }) => ({
        url: `/cart/update/${bookId}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: (response: unknown) => updateCartItemQuantityResponseSchema.parse(response),
    }),
    removeCartItem: builder.mutation<z.infer<typeof removeCartItemResponseSchema>, number>({
      query: (bookId) => ({ url: `/cart/remove/${bookId}`, method: "DELETE" }),
      transformResponse: (response: unknown) => removeCartItemResponseSchema.parse(response),
    }),
  }),
})

const {
  useGetCartQuery,
  useGetCartSummaryQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} = cartApi

export {
  cartApi,
  useGetCartQuery,
  useGetCartSummaryQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
}
