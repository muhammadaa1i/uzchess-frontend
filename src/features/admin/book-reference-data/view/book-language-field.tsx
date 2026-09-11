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
import type { BookLanguage } from "@/features/admin/book-reference-data/model/book-reference-data-schemas"

interface BookLanguageFieldProps {
  languages: BookLanguage[]
  value: string
  onChange: (value: string) => void
  error?: { message?: string }
}

// Same plain controlled shape as book-category-field.tsx — see that file's
// comment for why this doesn't take react-hook-form's `Controller` directly.
function BookLanguageField({ languages, value, onChange, error }: BookLanguageFieldProps) {
  const t = useTranslations("Admin.bookManagement.form")

  return (
    <Field>
      <FieldLabel>{t("languageLabel")}</FieldLabel>
      <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("languagePlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.id} value={String(language.id)}>
              {language.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  )
}

export { BookLanguageField }
