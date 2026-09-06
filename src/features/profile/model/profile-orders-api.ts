import { z } from "zod"

import {
  orderSchema,
  profileCourseItemSchema,
} from "@/features/profile/model/profile-schemas"
import { baseApi } from "@/lib/api/base-api"

// Split from profile-api.ts by concern (the "purchased" lists vs. the core
// profile/security forms), same pattern as Courses' course-detail-api.ts vs.
// course-progress-api.ts.
const profileOrdersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /orders — the "purchased products" (books) list per CLAUDE.md's
    // terminology note.
    getOrders: builder.query<z.infer<typeof orderSchema>[], void>({
      query: () => ({ url: "/orders" }),
      transformResponse: (response: unknown) => z.array(orderSchema).parse(response),
    }),
    getPurchasedCourses: builder.query<z.infer<typeof profileCourseItemSchema>[], void>({
      query: () => ({ url: "/courses/purchased" }),
      transformResponse: (response: unknown) => z.array(profileCourseItemSchema).parse(response),
    }),
  }),
})

const { useGetOrdersQuery, useGetPurchasedCoursesQuery } = profileOrdersApi

export { profileOrdersApi, useGetOrdersQuery, useGetPurchasedCoursesQuery }
