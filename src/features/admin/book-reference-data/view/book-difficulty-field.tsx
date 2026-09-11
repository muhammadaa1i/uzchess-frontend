"use client"

import { useTranslations } from "next-intl"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BookDifficulty } from "@/features/admin/book-reference-data/model/book-reference-data-schemas"

interface BookDifficultyFieldProps {
  difficulties: BookDifficulty[]
  value: string
  onChange: (value: string) => void
  error?: { message?: string }
}

// Same plain controlled shape as book-category-field.tsx — see that file's
// comment for why this doesn't take react-hook-form's `Controller` directly.
function BookDifficultyField({ difficulties, value, onChange, error }: BookDifficultyFieldProps) {
  const t = useTranslations("Admin.bookManagement.form")

  return (
    <Field>
      <FieldLabel>{t("difficultyLabel")}</FieldLabel>
      <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("difficultyPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {difficulties.map((difficulty) => (
            <SelectItem key={difficulty.id} value={String(difficulty.id)}>
              {difficulty.degree}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  )
}

export { BookDifficultyField }
