import type { z } from "zod"

import {
  deleteCourseResponseSchema,
  paginatedCoursesAdminSchema,
} from "@/features/admin/course-list/model/course-list-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetAdminCoursesParams {
  page?: number
  size?: number
}

// Course list's own RTK Query endpoints, injected into the shared
// endpoint-less `baseApi` (see CLAUDE.md's code-splitting mandate) — kept
// separate from the public course-catalog feature's identically-shaped
// `getCourses` endpoint (src/features/courses/course-catalog/model/course-catalog-api.ts)
// and from the sibling course-editor slice's `createCourse`/`updateCourse`/
// reference-list endpoints, since endpoints for one feature/slice must not
// live in another slice's model file even against the same backend route.
// `deleteCourse` lives here (not course-editor) since delete is triggered
// from a list row, not the create/edit form. Mutations are admin-only per
// CLAUDE.md's admin-panel note (backend-enforced via `@Roles(Role.Admin)` on
// CourseController — only the GET routes are `@Public()`). No RTK Query tag
// invalidation is used anywhere in this codebase yet — list refreshes are
// done via an explicit `refetch()` call after a mutation succeeds, same
// pattern as book-list-api.ts.
const courseListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCourses: builder.query<
      z.infer<typeof paginatedCoursesAdminSchema>,
      GetAdminCoursesParams | void
    >({
      query: (params) => ({ url: "/courses/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedCoursesAdminSchema.parse(response),
    }),
    deleteCourse: builder.mutation<z.infer<typeof deleteCourseResponseSchema>, number>({
      query: (id) => ({ url: `/courses/delete/${id}`, method: "DELETE" }),
      transformResponse: (response: unknown) => deleteCourseResponseSchema.parse(response),
    }),
  }),
})

const { useGetAdminCoursesQuery, useDeleteCourseMutation } = courseListApi

export { courseListApi, useDeleteCourseMutation, useGetAdminCoursesQuery }
