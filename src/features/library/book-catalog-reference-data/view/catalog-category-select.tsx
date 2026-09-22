"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type BookCategory,
  translateCategoryTitle,
} from "@/features/library/book-catalog-reference-data/model/book-catalog-reference-data-schemas"

interface CatalogCategorySelectProps {
  categories: BookCategory[]
  value: string
  onValueChange: (value: string) => void
  anyValue: string
  anyLabel: string
  placeholder: string
  currentLabel: (value: string) => string
  categoryLabels: Record<string, string>
}

// The category reference list's own picker widget — lives in this
// data-owning slice rather than the sibling book-catalog-filters slice that
// composes it, mirroring admin/book-reference-data's BookCategoryField (see
// CLAUDE.md's feature-granularity convention: a reference list and the
// picker bound to it stay together).
function CatalogCategorySelect({
  categories,
  value,
  onValueChange,
  anyValue,
  anyLabel,
  placeholder,
  currentLabel,
  categoryLabels,
}: CatalogCategorySelectProps) {
  return (
    <Select value={value} onValueChange={(next) => next && onValueChange(next)}>
      <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
        <SelectValue placeholder={placeholder}>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={anyValue}>{anyLabel}</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={String(category.id)}>
            {translateCategoryTitle(categoryLabels, category.title)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { CatalogCategorySelect }
