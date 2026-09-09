import { z } from "zod"

import { profileCourseItemSchema } from "@/features/purchased-courses/model/profile-purchased-courses-schemas"
import { baseApi } from "@/lib/api/base-api"

// Split out of Profile's "purchased" lists (originally grouped with
// GET /orders in profile-orders-api.ts) into its own top-level feature per
// the Profile tab's own data-fetching concern, same pattern as Library
// splitting into book-catalog/book-detail/book-rating.
const purchasedCoursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPurchasedCourses: builder.query<z.infer<typeof profileCourseItemSchema>[], void>({
      query: () => ({ url: "/courses/purchased" }),
      transformResponse: (response: unknown) => z.array(profileCourseItemSchema).parse(response),
    }),
  }),
})

const { useGetPurchasedCoursesQuery } = purchasedCoursesApi

export { purchasedCoursesApi, useGetPurchasedCoursesQuery }
