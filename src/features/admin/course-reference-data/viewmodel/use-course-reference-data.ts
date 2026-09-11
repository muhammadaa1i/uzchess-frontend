import {
  useGetAdminCourseAuthorsQuery,
  useGetAdminCourseCategoriesQuery,
  useGetAdminCourseDifficultiesQuery,
  useGetAdminCourseLanguagesQuery,
} from "@/features/admin/course-reference-data/model/course-reference-data-api"

interface UseCourseReferenceDataOptions {
  enabled: boolean
}

// Combines the four reference-list queries course-editor's create/edit form
// needs (category/author/difficulty/language selects/checkbox-list) into one
// hook with a single combined loading flag — `enabled` mirrors the "gate on
// dialog `open`" reasoning from the sibling Books domain's
// use-book-reference-data.ts: the dialog stays mounted in each row for the
// row's whole lifetime, only its visibility toggles, so without this every
// row would fire all four reference-list requests as soon as the page loads
// instead of on demand.
function useCourseReferenceData({ enabled }: UseCourseReferenceDataOptions) {
  const { data: categories, isFetching: isCategoriesLoading } = useGetAdminCourseCategoriesQuery(
    undefined,
    { skip: !enabled }
  )
  const { data: authors, isFetching: isAuthorsLoading } = useGetAdminCourseAuthorsQuery(
    undefined,
    { skip: !enabled }
  )
  const { data: difficulties, isFetching: isDifficultiesLoading } =
    useGetAdminCourseDifficultiesQuery(undefined, { skip: !enabled })
  const { data: languages, isFetching: isLanguagesLoading } = useGetAdminCourseLanguagesQuery(
    undefined,
    { skip: !enabled }
  )

  return {
    categories: categories ?? [],
    authors: authors ?? [],
    difficulties: difficulties ?? [],
    languages: languages ?? [],
    isLoading: isCategoriesLoading || isAuthorsLoading || isDifficultiesLoading || isLanguagesLoading,
  }
}

export { useCourseReferenceData }
