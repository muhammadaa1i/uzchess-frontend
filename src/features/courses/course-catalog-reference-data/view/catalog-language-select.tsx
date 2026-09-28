"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type CourseLanguage,
  translateLanguageTitle,
} from "@/features/courses/course-catalog-reference-data/model/course-catalog-reference-data-schemas"

interface CatalogLanguageSelectProps {
  languages: CourseLanguage[]
  value: string
  onValueChange: (value: string) => void
  anyValue: string
  anyLabel: string
  placeholder: string
  currentLabel: (value: string) => string
  languageLabels: Record<string, string>
}

// The language reference list's own picker widget — see
// catalog-category-select.tsx for why this lives in the data-owning slice
// rather than course-catalog-filters. `title` is admin-entered in a single
// locale (e.g. "O'zbek"), same as category/difficulty, so it's translated
// via the same labels-dictionary pattern rather than rendered as-is.
function CatalogLanguageSelect({
  languages,
  value,
  onValueChange,
  anyValue,
  anyLabel,
  placeholder,
  currentLabel,
  languageLabels,
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
            {translateLanguageTitle(languageLabels, language.title)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { CatalogLanguageSelect }
