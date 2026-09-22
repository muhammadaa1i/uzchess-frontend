import {
  useGetBookCatalogAuthorsQuery,
  useGetBookCatalogCategoriesQuery,
  useGetBookCatalogDifficultiesQuery,
  useGetBookCatalogLanguagesQuery,
} from "@/features/library/book-catalog-reference-data/model/book-catalog-reference-data-api"

// Combines the four reference-list queries both the book-catalog (results
// grid) and book-catalog-filters (filter selects) sibling slices need into
// one hook with a single combined loading flag — mirrors admin's
// use-book-reference-data.ts, minus the dialog-`enabled` gate, since the
// public catalog page always needs this data up front rather than only once
// a dialog opens.
function useBookCatalogReferenceData() {
  const { data: categories, isFetching: isCategoriesLoading } = useGetBookCatalogCategoriesQuery()
  const { data: authors, isFetching: isAuthorsLoading } = useGetBookCatalogAuthorsQuery()
  const { data: difficulties, isFetching: isDifficultiesLoading } =
    useGetBookCatalogDifficultiesQuery()
  const { data: languages, isFetching: isLanguagesLoading } = useGetBookCatalogLanguagesQuery()

  return {
    categories: categories ?? [],
    authors: authors ?? [],
    difficulties: difficulties ?? [],
    languages: languages ?? [],
    isLoading:
      isCategoriesLoading || isAuthorsLoading || isDifficultiesLoading || isLanguagesLoading,
  }
}

export { useBookCatalogReferenceData }
