import { z } from "zod"

import {
  courseCategorySchema,
  courseDetailSchema,
  courseDifficultySchema,
  coursePurchaseSchema,
  type createPurchaseRequestSchema,
  createPurchaseResponseSchema,
} from "@/features/courses/course-detail/model/course-detail-schemas"
import { baseApi } from "@/lib/api/base-api"

// This feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate). The two
// lookup-list endpoints duplicate course-catalog's `getCourseCategories`/
// `getCourseDifficulties` against the same backend routes under distinct
// endpoint names — RTK Query endpoint names are global across every
// `injectEndpoints` call on one `baseApi`, so two features can't share a
// name, and importing course-catalog's hooks here would pull that feature's
// model file into this route's bundle. The duplicate network request is a
// deliberate, small tradeoff for keeping both features independently
// reachable only through their own routes.
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
    getCourseDetailCategories: builder.query<z.infer<typeof courseCategorySchema>[], void>({
      query: () => ({ url: "/courses/categories/read" }),
      transformResponse: (response: unknown) => z.array(courseCategorySchema).parse(response),
    }),
    getCourseDetailDifficulties: builder.query<z.infer<typeof courseDifficultySchema>[], void>({
      query: () => ({ url: "/difficulty/read" }),
      transformResponse: (response: unknown) => z.array(courseDifficultySchema).parse(response),
    }),
  }),
})

const {
  useGetCourseByIdQuery,
  useGetPurchasedCoursesQuery,
  usePurchaseCourseMutation,
  useGetCourseDetailCategoriesQuery,
  useGetCourseDetailDifficultiesQuery,
} = courseDetailApi

export {
  courseDetailApi,
  useGetCourseByIdQuery,
  useGetCourseDetailCategoriesQuery,
  useGetCourseDetailDifficultiesQuery,
  useGetPurchasedCoursesQuery,
  usePurchaseCourseMutation,
}
