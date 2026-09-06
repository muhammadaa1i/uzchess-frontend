import { type z } from "zod"

import {
  cartSummarySchema,
  type checkoutRequestSchema,
  checkoutResponseSchema,
} from "@/features/checkout/model/checkout-schemas"
import { baseApi } from "@/lib/api/base-api"

// Checkout feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` — `getCartSummary` is kept out of Cart's
// `cart-api.ts` (which owns the same route for the Cart page itself) per
// CLAUDE.md's "no cross-feature endpoints" mandate, same duplication pattern
// Library's book-detail-api.ts already follows for `/cart/add/{id}`.
const checkoutApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Read-only, for the order-summary sidebar — the coupon `code` (if any)
    // is carried over from the Cart page via the /checkout?code= query
    // param, never re-entered on this page.
    getCartSummary: builder.query<z.infer<typeof cartSummarySchema>, { code?: string } | void>({
      query: (params) => ({ url: "/cart/summary", params: params?.code ? { code: params.code } : undefined }),
      transformResponse: (response: unknown) => cartSummarySchema.parse(response),
    }),
    checkout: builder.mutation<z.infer<typeof checkoutResponseSchema>, z.infer<typeof checkoutRequestSchema>>({
      query: (body) => ({ url: "/orders/checkout", method: "POST", body }),
      transformResponse: (response: unknown) => checkoutResponseSchema.parse(response),
    }),
  }),
})

const { useCheckoutMutation, useGetCartSummaryQuery } = checkoutApi

export { checkoutApi, useCheckoutMutation, useGetCartSummaryQuery }
