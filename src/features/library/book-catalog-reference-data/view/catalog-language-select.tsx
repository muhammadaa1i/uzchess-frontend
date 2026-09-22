"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BookLanguage } from "@/features/library/book-catalog-reference-data/model/book-catalog-reference-data-schemas"

interface CatalogLanguageSelectProps {
  languages: BookLanguage[]
  value: string
  onValueChange: (value: string) => void
  anyValue: string
  anyLabel: string
  placeholder: string
  currentLabel: (value: string) => string
}

// The language reference list's own picker widget — see
// catalog-category-select.tsx for why this lives in the data-owning slice
// rather than book-catalog-filters. `title` is a real language name (not
// admin-entered free text like category/difficulty), so no translation
// dictionary is needed here.
function CatalogLanguageSelect({
  languages,
  value,
  onValueChange,
  anyValue,
  anyLabel,
  placeholder,
  currentLabel,
}: CatalogLanguageSelectProps) {
  return (
    <Select value={value} onValueChange={(next) => next && onValueChange(next)}>
      <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
        <SelectValue placeholder={placeholder}>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={anyValue}>{anyLabel}</SelectItem>
        {languages.map((language) => (
          <SelectItem key={language.id} value={String(language.id)}>
            {language.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { CatalogLanguageSelect }
