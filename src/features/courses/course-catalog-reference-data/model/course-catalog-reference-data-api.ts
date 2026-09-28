import { z } from "zod"

import {
  courseCategorySchema,
  courseDifficultySchema,
  courseLanguageSchema,
} from "@/features/courses/course-catalog-reference-data/model/course-catalog-reference-data-schemas"
import { baseApi } from "@/lib/api/base-api"

// Read-only reference-list endpoints (category/difficulty/language) shared
// by the sibling course-catalog (results grid's id-to-label badges) and
// course-catalog-filters (sidebar/mobile filter selects) slices — split into
// their own slice per CLAUDE.md's "self-contained data-fetching widget"
// feature-granularity convention, mirroring Library's identical
// book-catalog-reference-data split. Unlike course-detail's deliberate
// duplicate requests against these same routes (justified there because
// course-detail and course-catalog are never rendered on the same page),
// course-catalog and course-catalog-filters render together on one page
// load, so sharing one set of endpoints here lets both consumers hit the
// same RTK Query cache entry instead of firing two simultaneous, identical
// requests.
const courseCatalogReferenceDataApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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

const { useGetCourseCategoriesQuery, useGetCourseDifficultiesQuery, useGetCourseLanguagesQuery } =
  courseCatalogReferenceDataApi

export {
  courseCatalogReferenceDataApi,
  useGetCourseCategoriesQuery,
  useGetCourseDifficultiesQuery,
  useGetCourseLanguagesQuery,
}
