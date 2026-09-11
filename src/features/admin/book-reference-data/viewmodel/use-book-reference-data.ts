import {
  useGetAdminBookAuthorsQuery,
  useGetAdminBookCategoriesQuery,
  useGetAdminBookDifficultiesQuery,
  useGetAdminBookLanguagesQuery,
} from "@/features/admin/book-reference-data/model/book-reference-data-api"

interface UseBookReferenceDataOptions {
  enabled: boolean
}

// Combines the four reference-list queries book-editor's create/edit form
// needs (category/author/difficulty/language selects/checkbox-list) into one
// hook with a single combined loading flag — `enabled` mirrors the "gate on
// dialog `open`" reasoning from use-news-form.ts: the dialog stays mounted
// in each row for the row's whole lifetime, only its visibility toggles, so
// without this every row would fire all four reference-list requests as soon
// as the page loads instead of on demand.
function useBookReferenceData({ enabled }: UseBookReferenceDataOptions) {
  const { data: categories, isFetching: isCategoriesLoading } = useGetAdminBookCategoriesQuery(
    undefined,
    { skip: !enabled }
  )
  const { data: authors, isFetching: isAuthorsLoading } = useGetAdminBookAuthorsQuery(undefined, {
    skip: !enabled,
  })
  const { data: difficulties, isFetching: isDifficultiesLoading } =
    useGetAdminBookDifficultiesQuery(undefined, { skip: !enabled })
  const { data: languages, isFetching: isLanguagesLoading } = useGetAdminBookLanguagesQuery(
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

export { useBookReferenceData }
