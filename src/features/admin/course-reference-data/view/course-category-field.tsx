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
import type { CourseCategory } from "@/features/admin/course-reference-data/model/course-reference-data-schemas"

interface CourseCategoryFieldProps {
  categories: CourseCategory[]
  value: string
  onChange: (value: string) => void
  error?: { message?: string }
}

// A plain controlled `value`/`onChange` component (no react-hook-form
// coupling) so this slice's model layer never has to import course-editor's
// form-values type — course-editor-form.tsx wraps this in its own
// `Controller` (see CLAUDE.md's "sibling slices reuse View components, never
// each other's model layer" rule). One component per file per
// CLAUDE.md/feedback conventions rather than an inline `Select` block in the
// parent form.
function CourseCategoryField({ categories, value, onChange, error }: CourseCategoryFieldProps) {
  const t = useTranslations("Admin.courseManagement.form")

  return (
    <Field>
      <FieldLabel>{t("categoryLabel")}</FieldLabel>
      <Select value={value} onValueChange={(next) => onChange(next ?? "")}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={t("categoryPlaceholder")} />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError errors={[error]} />
    </Field>
  )
}

export { CourseCategoryField }
