import type { z } from "zod"

import { coursesResponseSchema } from "@/features/top-courses/model/top-courses-schemas"
import { baseApi } from "@/lib/api/base-api"

// Top-courses feature's own RTK Query endpoint, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — hits
// the same route as Live's `getLiveSidebarCourses` (see
// ../live/model/live-api.ts) but is declared independently under a distinct
// endpoint name.
const topCoursesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopRatedCourses: builder.query<z.infer<typeof coursesResponseSchema>, void>({
      query: () => ({ url: "/courses/top-rated" }),
      transformResponse: (response: unknown) => coursesResponseSchema.parse(response),
    }),
  }),
})

const { useGetTopRatedCoursesQuery } = topCoursesApi

export { topCoursesApi, useGetTopRatedCoursesQuery }
