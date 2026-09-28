import type { z } from "zod"

import {
  type createPurchaseRequestSchema,
  createPurchaseResponseSchema,
} from "@/features/courses/course-purchase/model/course-purchase-schemas"
import { baseApi } from "@/lib/api/base-api"

// This feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — split
// out of course-detail into its own sibling slice since the purchase flow
// (mutation, form, dialog steps) is a self-contained, next/dynamic-loaded
// widget per CLAUDE.md's feature-granularity convention (same reasoning as
// Library's book-rating split out of book-detail).
const coursePurchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    purchaseCourse: builder.mutation<
      z.infer<typeof createPurchaseResponseSchema>,
      { courseId: number; body: z.infer<typeof createPurchaseRequestSchema> }
    >({
      query: ({ courseId, body }) => ({
        url: `/courses/${courseId}/purchase`,
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => createPurchaseResponseSchema.parse(response),
    }),
  }),
})

const { usePurchaseCourseMutation } = coursePurchaseApi

export { coursePurchaseApi, usePurchaseCourseMutation }
