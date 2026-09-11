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
import type { CourseLanguage } from "@/features/admin/course-reference-data/model/course-reference-data-schemas"

interface CourseLanguageFieldProps {
  languages: CourseLanguage[]
  value: string
  onChange: (value: string) => void
  error?: { message?: string }
}

// Same plain controlled shape as course-category-field.tsx — see that file's
// comment for why this doesn't take react-hook-form's `Controller` directly.
function CourseLanguageField({ languages, value, onChange, error }: CourseLanguageFieldProps) {
  const t = useTranslations("Admin.courseManagement.form")

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

export { CourseLanguageField }
