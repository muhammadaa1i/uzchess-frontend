"use client"

import { useTranslations } from "next-intl"
import type { UseFormReturn } from "react-hook-form"

import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { CourseEditorFormValues } from "@/features/admin/course-editor/model/course-editor-form-schema"

interface CoursePricingFieldsProps {
  form: UseFormReturn<CourseEditorFormValues>
}

// The price/discountPrice grid — split out of course-editor-form.tsx per
// CLAUDE.md/feedback's one-component-per-file convention, same pattern as
// the sibling Books domain's book-pricing-fields.tsx.
function CoursePricingFields({ form }: CoursePricingFieldsProps) {
  const t = useTranslations("Admin.courseManagement.form")

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

export { CoursePricingFields }
