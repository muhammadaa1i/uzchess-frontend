import { z } from "zod"

import {
  courseCategorySchema,
  courseDifficultySchema,
  courseLanguageSchema,
  paginatedCoursesSchema,
} from "@/features/course-catalog/model/course-catalog-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetCoursesParams {
  search?: string
  categoryId?: number
  difficultyId?: number
  languageId?: number
  minRating?: number
  page?: number
  size?: number
}

// This feature's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from home's identically-shaped `getTopRatedCourses` endpoint in
// home-api.ts, and from course-detail's own category/difficulty lookup
// endpoints, since endpoints for one feature must not live in another
// feature's model file, even against the same backend route.
const courseCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<z.infer<typeof paginatedCoursesSchema>, GetCoursesParams | void>({
      query: (params) => ({ url: "/courses/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedCoursesSchema.parse(response),
    }),
    getCourseCategories: builder.query<z.infer<typeof courseCategorySchema>[], void>({
      query: () => ({ url: "/courses/categories/read" }),
      transformResponse: (response: unknown) => z.array(courseCategorySchema).parse(response),
    }),
    getCourseDifficulties: builder.query<z.infer<typeof courseDifficultySchema>[], void>({
      query: () => ({ url: "/difficulty/read" }),
      transformResponse: (response: unknown) => z.array(courseDifficultySchema).parse(response),
    }),
    getCourseLanguages: builder.query<z.infer<typeof courseLanguageSchema>[], void>({
      query: () => ({ url: "/languages/read" }),
      transformResponse: (response: unknown) => z.array(courseLanguageSchema).parse(response),
    }),
  }),
})

const {
  useGetCoursesQuery,
  useGetCourseCategoriesQuery,
  useGetCourseDifficultiesQuery,
  useGetCourseLanguagesQuery,
} = courseCatalogApi

export {
  courseCatalogApi,
  useGetCourseCategoriesQuery,
  useGetCourseDifficultiesQuery,
  useGetCourseLanguagesQuery,
  useGetCoursesQuery,
}
export type { GetCoursesParams }
