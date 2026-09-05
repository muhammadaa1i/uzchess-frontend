import type { z } from "zod"

import {
  type createCourseRatingRequestSchema,
  createCourseRatingResponseSchema,
  paginatedCourseReviewsSchema,
} from "@/features/courses/model/course-review-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetCourseReviewsParams {
  courseId: number
  page?: number
  size?: number
}

const courseReviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseReviews: builder.query<
      z.infer<typeof paginatedCourseReviewsSchema>,
      GetCourseReviewsParams
    >({
      query: ({ courseId, ...params }) => ({
        url: `/courses/reviews/${courseId}`,
        params,
      }),
      transformResponse: (response: unknown) => paginatedCourseReviewsSchema.parse(response),
    }),
    rateCourse: builder.mutation<
      z.infer<typeof createCourseRatingResponseSchema>,
      { courseId: number; body: z.infer<typeof createCourseRatingRequestSchema> }
    >({
      query: ({ courseId, body }) => ({
        url: `/courses/rate/${courseId}`,
        method: "POST",
        body,
      }),
      transformResponse: (response: unknown) => createCourseRatingResponseSchema.parse(response),
    }),
  }),
})

const { useGetCourseReviewsQuery, useRateCourseMutation } = courseReviewApi

export { courseReviewApi, useGetCourseReviewsQuery, useRateCourseMutation }
export type { GetCourseReviewsParams }
