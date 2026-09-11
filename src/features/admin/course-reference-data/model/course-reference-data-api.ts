import type { z } from "zod"

import {
  courseAuthorSchema,
  courseCategorySchema,
  courseDifficultySchema,
  courseLanguageSchema,
} from "@/features/admin/course-reference-data/model/course-reference-data-schemas"
import { baseApi } from "@/lib/api/base-api"

// Read-only reference-list endpoints (category/author/difficulty/language)
// that only ever back the sibling course-editor slice's create/edit form
// selects/checkbox-list — split into their own slice per CLAUDE.md's
// "self-contained data-fetching widget" feature-granularity convention,
// same as the sibling Books domain's book-reference-data slice.
// `getAdminCourseCategories` hits the course-specific
// `/courses/categories/read` endpoint (its own tag, "Course Categories", in
// the live /swagger/courses-json spec), while
// `getAdminCourseAuthors`/`getAdminCourseDifficulties`/
// `getAdminCourseLanguages` hit the shared books-group endpoints — the
// Course entity's `authorId`/`difficultyId`/`languageId` reference the same
// Author/Difficulty/Language entities as Book (confirmed against
// ../backend/src/features/common/entities/course/course.entity.ts and
// course-author.entity.ts), and there is no course-specific equivalent of
// any of the three. This feature does not add CRUD for these sub-catalogs
// themselves (explicitly out of scope, see CLAUDE.md's admin-panel deferred
// backlog) — all four routes are `@Public()` GETs on the backend, no admin
// gating needed here (course-editor's own create/update/delete mutations
// remain the admin-gated part).
const courseReferenceDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminCourseCategories: builder.query<z.infer<typeof courseCategorySchema>[], void>({
      query: () => ({ url: "/courses/categories/read" }),
      transformResponse: (response: unknown) => courseCategorySchema.array().parse(response),
    }),
    getAdminCourseAuthors: builder.query<z.infer<typeof courseAuthorSchema>[], void>({
      query: () => ({ url: "/authors/read" }),
      transformResponse: (response: unknown) => courseAuthorSchema.array().parse(response),
    }),
    getAdminCourseDifficulties: builder.query<z.infer<typeof courseDifficultySchema>[], void>({
      query: () => ({ url: "/difficulty/read" }),
      transformResponse: (response: unknown) => courseDifficultySchema.array().parse(response),
    }),
    getAdminCourseLanguages: builder.query<z.infer<typeof courseLanguageSchema>[], void>({
      query: () => ({ url: "/languages/read" }),
      transformResponse: (response: unknown) => courseLanguageSchema.array().parse(response),
    }),
  }),
})

const {
  useGetAdminCourseCategoriesQuery,
  useGetAdminCourseAuthorsQuery,
  useGetAdminCourseDifficultiesQuery,
  useGetAdminCourseLanguagesQuery,
} = courseReferenceDataApi

export {
  courseReferenceDataApi,
  useGetAdminCourseAuthorsQuery,
  useGetAdminCourseCategoriesQuery,
  useGetAdminCourseDifficultiesQuery,
  useGetAdminCourseLanguagesQuery,
}
