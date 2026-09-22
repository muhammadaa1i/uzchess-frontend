"use client"

import { CatalogHeader } from "@/features/library/book-catalog/view/catalog-header"
import { CatalogResults } from "@/features/library/book-catalog/view/catalog-results"
import { useBookCatalog } from "@/features/library/book-catalog/viewmodel/use-book-catalog"
import { CatalogFilterPanel } from "@/features/library/book-catalog-filters/view/catalog-filter-panel"
import {
  type BookAuthor,
  type BookCategory,
  type BookDifficulty,
  type BookLanguage,
} from "@/features/library/book-catalog-reference-data/model/book-catalog-reference-data-schemas"

function BooksCatalogView() {
  const {
    books,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    totalPages,
    hasNext,
    hasPrevious,
    filters,
    searchInput,
    updateSearch,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    categories,
    difficulties,
    languages,
    authors,
    anyCategory,
    anyDifficulty,
    anyLanguage,
    anyRating,
  } = useBookCatalog()

  const categoryById = new Map<number, BookCategory>(
    categories.map((category) => [category.id, category])
  )
  const authorsById = new Map<number, BookAuthor>(authors.map((author) => [author.id, author]))
  const difficultyById = new Map<number, BookDifficulty>(
    difficulties.map((difficulty) => [difficulty.id, difficulty])
  )
  const languageById = new Map<number, BookLanguage>(
    languages.map((language) => [language.id, language])
  )

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <CatalogHeader searchInput={searchInput} onSearchChange={updateSearch} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <CatalogFilterPanel
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          filters={filters}
          updateFilter={updateFilter}
          anyCategory={anyCategory}
          anyDifficulty={anyDifficulty}
          anyLanguage={anyLanguage}
          anyRating={anyRating}
        />

        <CatalogResults
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
          books={books}
          categoryById={categoryById}
          difficultyById={difficultyById}
          languageById={languageById}
          authorsById={authorsById}
          page={page}
          totalPages={totalPages}
          hasNext={hasNext}
          hasPrevious={hasPrevious}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}

export { BooksCatalogView }
