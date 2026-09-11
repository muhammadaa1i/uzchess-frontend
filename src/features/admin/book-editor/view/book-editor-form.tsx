"use client"

import { useTranslations } from "next-intl"
import type { FormEvent } from "react"
import { Controller } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { DialogTitle } from "@/components/ui/dialog"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import type { BookEditorFormValues } from "@/features/admin/book-editor/model/book-editor-form-schema"
import { BookCoverField } from "@/features/admin/book-editor/view/book-cover-field"
import { BookMetaFields } from "@/features/admin/book-editor/view/book-meta-fields"
import { BookPricingFields } from "@/features/admin/book-editor/view/book-pricing-fields"
import type {
  BookAuthor,
  BookCategory,
  BookDifficulty,
  BookLanguage,
} from "@/features/admin/book-reference-data/model/book-reference-data-schemas"
import { BookAuthorCheckboxList } from "@/features/admin/book-reference-data/view/book-author-checkbox-list"
import { BookCategoryField } from "@/features/admin/book-reference-data/view/book-category-field"
import { BookDifficultyField } from "@/features/admin/book-reference-data/view/book-difficulty-field"
import { BookLanguageField } from "@/features/admin/book-reference-data/view/book-language-field"

interface BookEditorFormProps {
  title: string
  form: UseFormReturn<BookEditorFormValues>
  onSubmit: (event: FormEvent) => void
  isLoading: boolean
  isReferenceDataLoading: boolean
  formError: string | null
  selectedImageName: string | null
  existingImageUrl: string | null
  onImageChange: (file: File | undefined) => void
  submitLabel: string
  categories: BookCategory[]
  authors: BookAuthor[]
  difficulties: BookDifficulty[]
  languages: BookLanguage[]
}

// Pure field composition shared by both create and edit modes
// (book-editor-dialog.tsx decides which mutation `onSubmit` actually calls
// via use-book-editor-form.ts) — same "dumb View, hook owns the logic" split
// as news-management-form.tsx/banner-management-form.tsx. The individual
// field groups (pricing/meta/cover) live in their own files in this slice,
// and the reference-data-driven fields (category/difficulty/language
// selects, author checkbox list) live in the sibling book-reference-data
// slice — this file's only job is composing them behind the shared
// `Controller` wiring for react-hook-form.
function BookEditorForm({
  title,
  form,
  onSubmit,
  isLoading,
  isReferenceDataLoading,
  formError,
  selectedImageName,
  existingImageUrl,
  onImageChange,
  submitLabel,
  categories,
  authors,
  difficulties,
  languages,
}: BookEditorFormProps) {
  const t = useTranslations("Admin.bookManagement.form")

  return (
    <div className="flex flex-col gap-4">
      <DialogTitle>{title}</DialogTitle>

      {isReferenceDataLoading ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-9 w-full" />
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

          <BookPricingFields form={form} />

          <Field>
            <FieldLabel htmlFor="description">{t("descriptionLabel")}</FieldLabel>
            <Textarea id="description" rows={4} {...form.register("description")} />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <BookMetaFields form={form} />

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <BookCategoryField
                categories={categories}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.categoryId}
              />
            )}
          />

          <Controller
            control={form.control}
            name="difficultyId"
            render={({ field }) => (
              <BookDifficultyField
                difficulties={difficulties}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.difficultyId}
              />
            )}
          />

          <Controller
            control={form.control}
            name="languageId"
            render={({ field }) => (
              <BookLanguageField
                languages={languages}
                value={field.value}
                onChange={field.onChange}
                error={form.formState.errors.languageId}
              />
            )}
          />

          <Controller
            control={form.control}
            name="authorIds"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t("authorsLabel")}</FieldLabel>
                <BookAuthorCheckboxList
                  authors={authors}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FieldError errors={[form.formState.errors.authorIds]} />
              </Field>
            )}
          />

          <BookCoverField
            selectedImageName={selectedImageName}
            existingImageUrl={existingImageUrl}
            onImageChange={onImageChange}
          />

          {formError && <p className="text-sm text-destructive">{formError}</p>}

          <Button type="submit" disabled={isLoading} className="self-start">
            {submitLabel}
          </Button>
        </form>
      )}
    </div>
  )
}

export { BookEditorForm }
