"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  type BookDifficulty,
  translateDifficultyDegree,
} from "@/features/library/book-catalog-reference-data/model/book-catalog-reference-data-schemas"

interface CatalogDifficultySelectProps {
  difficulties: BookDifficulty[]
  value: string
  onValueChange: (value: string) => void
  anyValue: string
  anyLabel: string
  placeholder: string
  currentLabel: (value: string) => string
  difficultyLabels: Record<string, string>
}

// The difficulty reference list's own picker widget — see
// catalog-category-select.tsx for why this lives in the data-owning slice
// rather than book-catalog-filters.
function CatalogDifficultySelect({
  difficulties,
  value,
  onValueChange,
  anyValue,
  anyLabel,
  placeholder,
  currentLabel,
  difficultyLabels,
}: CatalogDifficultySelectProps) {
  return (
    <Select value={value} onValueChange={(next) => next && onValueChange(next)}>
      <SelectTrigger className="h-14! w-full justify-between rounded-lg border border-[#232627] bg-[#15181A] px-4 text-sm text-brand-white">
        <SelectValue placeholder={placeholder}>{currentLabel}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={anyValue}>{anyLabel}</SelectItem>
        {difficulties.map((difficulty) => (
          <SelectItem key={difficulty.id} value={String(difficulty.id)}>
            {translateDifficultyDegree(difficultyLabels, difficulty.degree)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { CatalogDifficultySelect }
