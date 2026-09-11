"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useId } from "react"
import type { FormEvent } from "react"
import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { BannerFormValues } from "@/features/admin/banner-management/model/banner-management-form-schema"

interface BannerManagementFormProps {
  title: string
  form: UseFormReturn<BannerFormValues>
  onSubmit: (event: FormEvent) => void
  isLoading: boolean
  formError: string | null
  selectedImageName: string | null
  existingImageUrl: string | null
  onImageChange: (file: File | undefined) => void
  submitLabel: string
}

// Pure form fields shared by both create and edit modes
// (banner-form-dialog.tsx decides which mutation `onSubmit` actually calls
// via use-banner-form.ts) — same "dumb View, hook owns the logic" split as
// news-management-form.tsx. Image upload mirrors news-management-form.tsx's
// file-input pattern (no live blob-URL preview, just the selected file's
// name — same next/image limitation noted there). `isActive` uses a
// Controller-wrapped Switch since it isn't a native form input, same pattern
// as sign-up-form.tsx's Checkbox-wrapped `acceptTerms` field.
function BannerManagementForm({
  title,
  form,
  onSubmit,
  isLoading,
  formError,
  selectedImageName,
  existingImageUrl,
  onImageChange,
  submitLabel,
}: BannerManagementFormProps) {
  const t = useTranslations("Admin.bannerManagement.form")
  const imageInputId = useId()

  return (
    <div className="flex flex-col gap-4">
      <DialogTitle>{title}</DialogTitle>

      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="title">{t("titleLabel")}</FieldLabel>
          <Input id="title" {...form.register("title")} />
          <FieldError errors={[form.formState.errors.title]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="subtitle">{t("subtitleLabel")}</FieldLabel>
          <Input id="subtitle" {...form.register("subtitle")} />
          <FieldError errors={[form.formState.errors.subtitle]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="linkUrl">{t("linkUrlLabel")}</FieldLabel>
          <Input id="linkUrl" {...form.register("linkUrl")} />
          <FieldError errors={[form.formState.errors.linkUrl]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="badgeText">{t("badgeTextLabel")}</FieldLabel>
          <Input id="badgeText" placeholder={t("badgeTextPlaceholder")} {...form.register("badgeText")} />
          <FieldError errors={[form.formState.errors.badgeText]} />
        </Field>

        <Controller
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <Field orientation="horizontal">
              <Switch
                id="isActive"
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked)}
              />
              <FieldLabel htmlFor="isActive" className="font-normal">
                {t("isActiveLabel")}
              </FieldLabel>
            </Field>
          )}
        />

        <Field>
          <FieldLabel htmlFor={imageInputId}>{t("imageLabel")}</FieldLabel>
          {existingImageUrl && !selectedImageName && (
            <div className="relative h-28 w-full overflow-hidden rounded-lg bg-dark-2">
              <Image src={existingImageUrl} alt="" fill className="object-cover" />
            </div>
          )}
          <Input
            id={imageInputId}
            type="file"
            accept="image/*"
            onChange={(event) => onImageChange(event.target.files?.[0])}
          />
          <p className="text-xs text-brand-secondary-low">
            {selectedImageName ? t("imageSelected", { name: selectedImageName }) : t("imageHint")}
          </p>
        </Field>

        {formError && <p className="text-sm text-destructive">{formError}</p>}

        <Button type="submit" disabled={isLoading} className="self-start">
          {submitLabel}
        </Button>
      </form>
    </div>
  )
}

export { BannerManagementForm }
