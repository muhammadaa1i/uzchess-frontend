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
import type { CourseEditorFormValues } from "@/features/admin/course-editor/model/course-editor-form-schema"
import { CourseCoverField } from "@/features/admin/course-editor/view/course-cover-field"
import { CoursePricingFields } from "@/features/admin/course-editor/view/course-pricing-fields"
import type {
  CourseAuthor,
  CourseCategory,
  CourseDifficulty,
  CourseLanguage,
} from "@/features/admin/course-reference-data/model/course-reference-data-schemas"
import { CourseAuthorCheckboxList } from "@/features/admin/course-reference-data/view/course-author-checkbox-list"
import { CourseCategoryField } from "@/features/admin/course-reference-data/view/course-category-field"
import { CourseDifficultyField } from "@/features/admin/course-reference-data/view/course-difficulty-field"
import { CourseLanguageField } from "@/features/admin/course-reference-data/view/course-language-field"

interface CourseEditorFormProps {
  title: string
  form: UseFormReturn<CourseEditorFormValues>
  onSubmit: (event: FormEvent) => void
  isLoading: boolean
  isReferenceDataLoading: boolean
  formError: string | null
  selectedImageName: string | null
  existingImageUrl: string | null
  onImageChange: (file: File | undefined) => void
  submitLabel: string
  categories: CourseCategory[]
  authors: CourseAuthor[]
  difficulties: CourseDifficulty[]
  languages: CourseLanguage[]
}

// Pure field composition shared by both create and edit modes
// (course-editor-dialog.tsx decides which mutation `onSubmit` actually calls
// via use-course-editor-form.ts) — same "dumb View, hook owns the logic"
// split as book-editor-form.tsx. The pricing/cover field groups live in
// their own files in this slice, and the reference-data-driven fields
// (category/difficulty/language selects, author checkbox list) live in the
// sibling course-reference-data slice — this file's only job is composing
// them behind the shared `Controller` wiring for react-hook-form. Unlike
// Book, Course has no page-count/published-year fields (confirmed against
// the live /swagger/courses-json spec — no such columns on the Course
// entity), so there's no meta-fields group here.
function CourseEditorForm({
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
}: CourseEditorFormProps) {
  const t = useTranslations("Admin.courseManagement.form")

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

          <CoursePricingFields form={form} />

          <Field>
            <FieldLabel htmlFor="description">{t("descriptionLabel")}</FieldLabel>
            <Textarea id="description" rows={4} {...form.register("description")} />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <Controller
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <CourseCategoryField
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
              <CourseDifficultyField
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
              <CourseLanguageField
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
                <CourseAuthorCheckboxList
                  authors={authors}
                  value={field.value}
                  onChange={field.onChange}
                />
                <FieldError errors={[form.formState.errors.authorIds]} />
              </Field>
            )}
          />

          <CourseCoverField
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

export { CourseEditorForm }
