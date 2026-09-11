"use client"

import { useTranslations } from "next-intl"
import type { UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { BookEditorFormValues } from "@/features/admin/book-editor/model/book-editor-form-schema"

interface BookPricingFieldsProps {
  form: UseFormReturn<BookEditorFormValues>
}

// The price/discountPrice grid — split out of book-editor-form.tsx per
// CLAUDE.md/feedback's one-component-per-file convention.
function BookPricingFields({ form }: BookPricingFieldsProps) {
  const t = useTranslations("Admin.bookManagement.form")

  return (
    <div className="grid grid-cols-2 gap-4">
      <Field>
        <FieldLabel htmlFor="price">{t("priceLabel")}</FieldLabel>
        <Input id="price" type="number" inputMode="numeric" {...form.register("price")} />
        <FieldError errors={[form.formState.errors.price]} />
      </Field>

      <Field>
        <FieldLabel htmlFor="discountPrice">{t("discountPriceLabel")}</FieldLabel>
        <Input
          id="discountPrice"
          type="number"
          inputMode="numeric"
          placeholder={t("discountPricePlaceholder")}
          {...form.register("discountPrice")}
        />
        <FieldError errors={[form.formState.errors.discountPrice]} />
      </Field>
    </div>
  )
}

export { BookPricingFields }
