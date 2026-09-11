"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"
import { useId } from "react"
import type { FormEvent } from "react"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import type { NewsFormValues } from "@/features/admin/news-management/model/news-management-form-schema"

interface NewsManagementFormProps {
  title: string
  form: UseFormReturn<NewsFormValues>
  onSubmit: (event: FormEvent) => void
  isLoading: boolean
  isDetailLoading: boolean
  formError: string | null
  selectedImageName: string | null
  existingImageUrl: string | null
  onImageChange: (file: File | undefined) => void
  submitLabel: string
}

// Pure form fields shared by both create and edit modes (news-form-dialog.tsx
// decides which mutation `onSubmit` actually calls via use-news-form.ts) —
// same "dumb View, hook owns the logic" split as PurchaseModalForm. Image
// upload mirrors profile-edit-form.tsx's file-input pattern, except there's
// no live blob-URL preview for the newly picked file: next/image can't
// render a `blob:` object URL (see profile-edit-form.tsx's comment on that
// exact limitation), and unlike the avatar it isn't cropped to a fixed
// circle via the Avatar/AvatarImage primitive, so this just shows the
// selected file's name instead of a thumbnail.
function NewsManagementForm({
  title,
  form,
  onSubmit,
  isLoading,
  isDetailLoading,
  formError,
  selectedImageName,
  existingImageUrl,
  onImageChange,
  submitLabel,
}: NewsManagementFormProps) {
  const t = useTranslations("Admin.newsManagement.form")
  const imageInputId = useId()

  return (
    <div className="flex flex-col gap-4">
      <DialogTitle>{title}</DialogTitle>

      {isDetailLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-32" />
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="title">{t("titleLabel")}</FieldLabel>
            <Input id="title" {...form.register("title")} />
            <FieldError errors={[form.formState.errors.title]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="excerpt">{t("excerptLabel")}</FieldLabel>
            <Textarea id="excerpt" rows={2} {...form.register("excerpt")} />
            <FieldError errors={[form.formState.errors.excerpt]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="content">{t("contentLabel")}</FieldLabel>
            <Textarea id="content" rows={6} {...form.register("content")} />
            <FieldError errors={[form.formState.errors.content]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="publishedAt">{t("publishedAtLabel")}</FieldLabel>
            <Input id="publishedAt" type="date" {...form.register("publishedAt")} />
            <FieldError errors={[form.formState.errors.publishedAt]} />
          </Field>

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
      )}
    </div>
  )
}

export { NewsManagementForm }
