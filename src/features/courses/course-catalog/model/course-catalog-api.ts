import { type z } from "zod"

import { paginatedCoursesSchema } from "@/features/courses/course-catalog/model/course-catalog-schemas"
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

// This feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from home's identically-shaped `getTopRatedCourses` endpoint in
// home-api.ts, and from course-detail's own category/difficulty lookup
// endpoints, since endpoints for one feature must not live in another
// feature's model file, even against the same backend route. The category/
// difficulty/language reference-list endpoints this feature used to also
// define here now live in the sibling course-catalog-reference-data slice,
// shared with course-catalog-filters — see that slice's
// course-catalog-reference-data-api.ts.
const courseCatalogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<z.infer<typeof paginatedCoursesSchema>, GetCoursesParams | void>({
      query: (params) => ({ url: "/courses/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedCoursesSchema.parse(response),
    }),
  }),
})

const { useGetCoursesQuery } = courseCatalogApi

export { courseCatalogApi, useGetCoursesQuery }
export type { GetCoursesParams }
