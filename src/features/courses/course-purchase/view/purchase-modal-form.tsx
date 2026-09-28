"use client"

import { useTranslations } from "next-intl"
import type { FormEvent } from "react"
import { Controller, type UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { PurchaseFormValues } from "@/features/courses/course-purchase/model/course-purchase-form-schema"
import { purchaseProviderSchema } from "@/features/courses/course-purchase/model/course-purchase-schemas"

const PROVIDERS = purchaseProviderSchema.options

interface PurchaseModalFormProps {
  form: UseFormReturn<PurchaseFormValues>
  onSubmit: (event: FormEvent) => void
  isLoading: boolean
}

function PurchaseModalForm({ form, onSubmit, isLoading }: PurchaseModalFormProps) {
  const t = useTranslations("Courses.purchase")

  return (
    <div className="flex flex-col gap-4">
      <DialogTitle>{t("title")}</DialogTitle>
      <DialogDescription>{t("description")}</DialogDescription>
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Controller
          control={form.control}
          name="provider"
          render={({ field }) => (
            <Field>
              <FieldLabel>{t("providerLabel")}</FieldLabel>
              <RadioGroup value={field.value} onValueChange={field.onChange}>
                {PROVIDERS.map((provider) => (
                  <FieldLabel key={provider} htmlFor={`provider-${provider}`}>
                    <Field orientation="horizontal">
                      <RadioGroupItem value={provider} id={`provider-${provider}`} />
                      {t(`providers.${provider}`)}
                    </Field>
                  </FieldLabel>
                ))}
              </RadioGroup>
            </Field>
          )}
        />
        <Button type="submit" disabled={isLoading} className="mt-2">
          {t("submit")}
        </Button>
      </form>
    </div>
  )
}

export { PurchaseModalForm }
