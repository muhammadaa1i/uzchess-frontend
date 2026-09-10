"use client"

import { useTranslations } from "next-intl"

import {
  type BookAuthor,
  type BookCategory,
  type BookDifficulty,
  type BookLanguage,
  translateCategoryTitle,
  translateDifficultyDegree,
} from "@/features/library/book-catalog/model/book-catalog-schemas"
import { CatalogHeader } from "@/features/library/book-catalog/view/catalog-header"
import { CatalogMobileFilterDialog } from "@/features/library/book-catalog/view/catalog-mobile-filter-dialog"
import { CatalogResults } from "@/features/library/book-catalog/view/catalog-results"
import { CatalogSidebarFilter } from "@/features/library/book-catalog/view/catalog-sidebar-filter"
import { useBookCatalog } from "@/features/library/book-catalog/viewmodel/use-book-catalog"

function BooksCatalogView() {
  const t = useTranslations("Library")
  const difficultyLabels = (t.raw as (key: string) => Record<string, string>)("difficultyLevels")
  const categoryLabels = (t.raw as (key: string) => Record<string, string>)("categoryLabels")
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

  // base-ui's Select.Value renders the raw `value` string (e.g. the "any"
  // sentinel or a numeric id) unless told how to turn a value into a label —
  // it does not read the matching SelectItem's children. Each trigger below
  // passes one of these instead of a bare placeholder so it shows the actual
  // translated/localized label rather than "any" or "3".
  function categoryLabel(value: string) {
    if (value === anyCategory) return t("filters.any")
    const title = categoryById.get(Number(value))?.title
    return title ? translateCategoryTitle(categoryLabels, title) : t("filters.category")
  }
  function difficultyLabel(value: string) {
    if (value === anyDifficulty) return t("filters.any")
    const degree = difficultyById.get(Number(value))?.degree
    return degree ? translateDifficultyDegree(difficultyLabels, degree) : t("filters.difficulty")
  }
  function languageLabel(value: string) {
    if (value === anyLanguage) return t("filters.any")
    return languageById.get(Number(value))?.title ?? t("filters.language")
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <CatalogHeader searchInput={searchInput} onSearchChange={updateSearch} />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <CatalogSidebarFilter
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          filters={filters}
          updateFilter={updateFilter}
          difficulties={difficulties}
          categories={categories}
          languages={languages}
          anyDifficulty={anyDifficulty}
          anyCategory={anyCategory}
          anyLanguage={anyLanguage}
          anyRating={anyRating}
          difficultyLabel={difficultyLabel}
          categoryLabel={categoryLabel}
          languageLabel={languageLabel}
          difficultyLabels={difficultyLabels}
          categoryLabels={categoryLabels}
        />

        <CatalogMobileFilterDialog
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
          filters={filters}
          updateFilter={updateFilter}
          difficulties={difficulties}
          categories={categories}
          languages={languages}
          anyDifficulty={anyDifficulty}
          anyCategory={anyCategory}
          anyLanguage={anyLanguage}
          anyRating={anyRating}
          difficultyLabel={difficultyLabel}
          categoryLabel={categoryLabel}
          languageLabel={languageLabel}
          difficultyLabels={difficultyLabels}
          categoryLabels={categoryLabels}
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
