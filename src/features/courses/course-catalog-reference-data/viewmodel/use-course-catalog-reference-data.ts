import {
  useGetCourseCategoriesQuery,
  useGetCourseDifficultiesQuery,
  useGetCourseLanguagesQuery,
} from "@/features/courses/course-catalog-reference-data/model/course-catalog-reference-data-api"

// Combines the three reference-list queries both the course-catalog
// (results grid) and course-catalog-filters (filter selects) sibling slices
// need into one hook with a single combined loading flag — mirrors
// Library's use-book-catalog-reference-data.ts.
function useCourseCatalogReferenceData() {
  const { data: categories, isFetching: isCategoriesLoading } = useGetCourseCategoriesQuery()
  const { data: difficulties, isFetching: isDifficultiesLoading } = useGetCourseDifficultiesQuery()
  const { data: languages, isFetching: isLanguagesLoading } = useGetCourseLanguagesQuery()

  return {
    categories: categories ?? [],
    difficulties: difficulties ?? [],
    languages: languages ?? [],
    isLoading: isCategoriesLoading || isDifficultiesLoading || isLanguagesLoading,
  }
}

export { useCourseCatalogReferenceData }
