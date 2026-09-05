import type { z } from "zod"

import {
  completeLessonResponseSchema,
  courseLessonsProgressResponseSchema,
  nextLessonResponseSchema,
} from "@/features/courses/model/course-progress-schemas"
import { baseApi } from "@/lib/api/base-api"

const courseProgressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourseLessonsProgress: builder.query<
      z.infer<typeof courseLessonsProgressResponseSchema>,
      number
    >({
      query: (courseId) => ({ url: `/courses/${courseId}/lessons` }),
      transformResponse: (response: unknown) =>
        courseLessonsProgressResponseSchema.parse(response),
    }),
    getNextLesson: builder.query<z.infer<typeof nextLessonResponseSchema>, number>({
      query: (lessonId) => ({ url: `/courses/lessons/${lessonId}/next` }),
      transformResponse: (response: unknown) => nextLessonResponseSchema.parse(response),
    }),
    completeLesson: builder.mutation<z.infer<typeof completeLessonResponseSchema>, number>({
      query: (lessonId) => ({ url: `/courses/lessons/${lessonId}/complete`, method: "POST" }),
      transformResponse: (response: unknown) => completeLessonResponseSchema.parse(response),
    }),
  }),
})

const { useGetCourseLessonsProgressQuery, useLazyGetNextLessonQuery, useCompleteLessonMutation } =
  courseProgressApi

export {
  courseProgressApi,
  useCompleteLessonMutation,
  useGetCourseLessonsProgressQuery,
  useLazyGetNextLessonQuery,
}
