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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import type { BookEditorFormValues } from "@/features/admin/book-editor/model/book-editor-form-schema"
import type {
  BookAuthor,
  BookCategory,
  BookDifficulty,
  BookLanguage,
} from "@/features/admin/book-editor/model/book-editor-schemas"
import { BookAuthorCheckboxList } from "@/features/admin/book-editor/view/book-author-checkbox-list"

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

// Pure form fields shared by both create and edit modes
// (book-editor-dialog.tsx decides which mutation `onSubmit` actually calls
// via use-book-editor-form.ts) — same "dumb View, hook owns the logic" split
// as news-management-form.tsx/banner-management-form.tsx. Category/
// difficulty/language are read-only reference selects (see CLAUDE.md's
// admin-panel scope note — no CRUD for those sub-catalogs here), authors is a
// Controller-wrapped checkbox list since it's a multi-value field. Cover
// upload mirrors news/banner's file-input pattern (no live blob-URL preview,
// just the selected file's name — same next/image limitation noted there).
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
  const coverInputId = useId()

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

          <Field>
            <FieldLabel htmlFor="description">{t("descriptionLabel")}</FieldLabel>
            <Textarea id="description" rows={4} {...form.register("description")} />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="pageCount">{t("pageCountLabel")}</FieldLabel>
              <Input
                id="pageCount"
                type="number"
                inputMode="numeric"
                {...form.register("pageCount")}
              />
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

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t("categoryLabel")}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
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
                <FieldError errors={[form.formState.errors.categoryId]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="difficultyId"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t("difficultyLabel")}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("difficultyPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map((difficulty) => (
                      <SelectItem key={difficulty.id} value={String(difficulty.id)}>
                        {difficulty.degree}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={[form.formState.errors.difficultyId]} />
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="languageId"
            render={({ field }) => (
              <Field>
                <FieldLabel>{t("languageLabel")}</FieldLabel>
                <Select value={field.value} onValueChange={field.onChange}>
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
                <FieldError errors={[form.formState.errors.languageId]} />
              </Field>
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

          <Field>
            <FieldLabel htmlFor={coverInputId}>{t("coverLabel")}</FieldLabel>
            {existingImageUrl && !selectedImageName && (
              <div className="relative h-28 w-full overflow-hidden rounded-lg bg-dark-2">
                <Image src={existingImageUrl} alt="" fill className="object-cover" />
              </div>
            )}
            <Input
              id={coverInputId}
              type="file"
              accept="image/*"
              onChange={(event) => onImageChange(event.target.files?.[0])}
            />
            <p className="text-xs text-brand-secondary-low">
              {selectedImageName ? t("coverSelected", { name: selectedImageName }) : t("coverHint")}
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

export { BookEditorForm }
