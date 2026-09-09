"use client"

import { useTranslations } from "next-intl"
import type { FormEvent } from "react"
import type { UseFormReturn } from "react-hook-form"

import { TextField } from "@/components/shared/form/text-field"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { ContactFormValues } from "@/features/contact/model/contact-form-schema"

interface ContactFormProps {
  form: UseFormReturn<ContactFormValues>
  onSubmit: (event: FormEvent) => void
  isSubmitting: boolean
  justSent: boolean
  submitError: string | null
}

function ContactForm({ form, onSubmit, isSubmitting, justSent, submitError }: ContactFormProps) {
  const t = useTranslations("Contact")

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-5"
    >
      <TextField
        label={t("form.name")}
        autoComplete="name"
        errors={[form.formState.errors.name]}
        {...form.register("name")}
      />
      <TextField
        label={t("form.email")}
        autoComplete="email"
        errors={[form.formState.errors.email]}
        {...form.register("email")}
      />
      <Field>
        <FieldLabel htmlFor="contact-message">{t("form.message")}</FieldLabel>
        <Textarea
          id="contact-message"
          placeholder={t("form.messagePlaceholder")}
          rows={5}
          {...form.register("message")}
        />
        <FieldError errors={[form.formState.errors.message]} />
      </Field>

      <Button type="submit" disabled={isSubmitting} className="mt-2">
        {isSubmitting ? t("form.sending") : t("form.submit")}
      </Button>
      {submitError ? <p className="text-sm text-brand-red">{submitError}</p> : null}
      {justSent ? <p className="text-sm text-brand-green">{t("form.success")}</p> : null}
    </form>
  )
}

export { ContactForm }
