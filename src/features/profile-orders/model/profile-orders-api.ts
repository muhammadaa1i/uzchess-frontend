import { z } from "zod"

import { orderSchema } from "@/features/profile-orders/model/profile-orders-schemas"
import { baseApi } from "@/lib/api/base-api"

// Split out of Profile's "purchased" lists (originally grouped with
// GET /courses/purchased in profile-orders-api.ts) into its own top-level
// feature per the Profile tab's own data-fetching concern, same pattern as
// Library splitting into book-catalog/book-detail/book-rating.
const profileOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /orders — the "purchased products" (books) list per CLAUDE.md's
    // terminology note.
    getOrders: builder.query<z.infer<typeof orderSchema>[], void>({
      query: () => ({ url: "/orders" }),
      transformResponse: (response: unknown) => z.array(orderSchema).parse(response),
    }),
  }),
})

const { useGetOrdersQuery } = profileOrdersApi

export { profileOrdersApi, useGetOrdersQuery }
