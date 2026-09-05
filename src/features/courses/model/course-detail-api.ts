import { z } from "zod"

import {
  courseDetailSchema,
  coursePurchaseSchema,
  type createPurchaseRequestSchema,
  createPurchaseResponseSchema,
} from "@/features/courses/model/course-schemas"
import { baseApi } from "@/lib/api/base-api"

const courseDetailApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseById: builder.query<z.infer<typeof courseDetailSchema>, number>({
      query: (id) => ({ url: `/courses/read/${id}` }),
      transformResponse: (response: unknown) => courseDetailSchema.parse(response),
    }),
    // GET /courses/purchased — authenticated; used to derive the "purchased"
    // badge/CTA state on the detail page. Callers should `skip` this query
    // when signed out rather than let it 401.
    getPurchasedCourses: builder.query<z.infer<typeof coursePurchaseSchema>[], void>({
      query: () => ({ url: "/courses/purchased" }),
      transformResponse: (response: unknown) => z.array(coursePurchaseSchema).parse(response),
    }),
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

const { useGetCourseByIdQuery, useGetPurchasedCoursesQuery, usePurchaseCourseMutation } =
  courseDetailApi

export {
  courseDetailApi,
  useGetCourseByIdQuery,
  useGetPurchasedCoursesQuery,
  usePurchaseCourseMutation,
}
