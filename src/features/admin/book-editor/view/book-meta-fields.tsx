"use client"

import { useTranslations } from "next-intl"
import type { UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { BookEditorFormValues } from "@/features/admin/book-editor/model/book-editor-form-schema"

interface BookMetaFieldsProps {
  form: UseFormReturn<BookEditorFormValues>
}

// The pageCount/publishedYear grid — split out of book-editor-form.tsx per
// CLAUDE.md/feedback's one-component-per-file convention.
function BookMetaFields({ form }: BookMetaFieldsProps) {
  const t = useTranslations("Admin.bookManagement.form")

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel htmlFor="pageCount">{t("pageCountLabel")}</FieldLabel>
        <Input id="pageCount" type="number" inputMode="numeric" {...form.register("pageCount")} />
        <FieldError errors={[form.formState.errors.pageCount]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="publishedYear">{t("publishedYearLabel")}</FieldLabel>
        <Input
          id="publishedYear"
          type="number"
          inputMode="numeric"
          {...form.register("publishedYear")}
        />
        <FieldError errors={[form.formState.errors.publishedYear]} />
      </Field>
    </div>
  )
}

export { BookMetaFields }
