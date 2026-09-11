import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "@/features/admin/course-editor/model/course-editor-api"
import { getCourseEditorErrorMessage } from "@/features/admin/course-editor/model/course-editor-error"
import {
  createCourseEditorFormSchema,
  type CourseEditorFormValues,
} from "@/features/admin/course-editor/model/course-editor-form-schema"
import type { CourseEditorItem } from "@/features/admin/course-editor/model/course-editor-schemas"
import { useCourseReferenceData } from "@/features/admin/course-reference-data/viewmodel/use-course-reference-data"

interface UseCourseEditorFormOptions {
  course?: CourseEditorItem
  open: boolean
  onSaved: () => void
}

const EMPTY_VALUES: CourseEditorFormValues = {
  title: "",
  price: "",
  discountPrice: "",
  description: "",
  categoryId: "",
  difficultyId: "",
  languageId: "",
  authorIds: [],
}

// Drives the create/edit course form shared by the sibling course-list
// slice's course-create-button.tsx and course-edit-button.tsx (which open
// this feature's course-editor-dialog.tsx) — POST /courses/create when
// `course` is absent, PATCH /courses/update/{id} when present. Same "no
// separate by-id fetch" shape as use-book-editor-form.ts: GET
// /courses/read's list response already carries every field the edit form
// needs (see course-editor-schemas.ts), so the row's own item is passed
// straight in. The category/author/difficulty/language reference-list
// fetching (backing this form's read-only reference selects/checkboxes)
// lives in the sibling course-reference-data slice — see that slice's
// use-course-reference-data.ts for why it's gated on `open` (renamed
// `enabled` there) the same way this form's mutations are scoped to this
// dialog's lifetime.
function useCourseEditorForm({ course, open, onSaved }: UseCourseEditorFormOptions) {
  const t = useTranslations("Admin.courseManagement")
  const tValidation = useTranslations("Admin.courseManagement.validation")
  const isEditMode = course !== undefined

  const { categories, authors, difficulties, languages, isLoading: isReferenceDataLoading } =
    useCourseReferenceData({ enabled: open })

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation()
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation()
  const [formError, setFormError] = useState<string | null>(null)
  const [selectedImageName, setSelectedImageName] = useState<string | null>(null)

  const form = useForm<CourseEditorFormValues>({
    resolver: zodResolver(createCourseEditorFormSchema(tValidation)),
    defaultValues: EMPTY_VALUES,
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      course
        ? {
            title: course.title,
            price: String(course.price),
            discountPrice:
              course.discountPrice !== null && course.discountPrice !== undefined
                ? String(course.discountPrice)
                : "",
            description: course.description,
            categoryId: String(course.categoryId),
            difficultyId: String(course.difficultyId),
            languageId: String(course.languageId),
            authorIds: course.authorIds,
          }
        : EMPTY_VALUES
    )
  }, [open, course, form])

  function onImageChange(file: File | undefined) {
    form.setValue("cover", file, { shouldDirty: true })
    setSelectedImageName(file?.name ?? null)
  }

  async function onSubmit(values: CourseEditorFormValues) {
    setFormError(null)

    // CreateCourseRequest requires `cover` on the backend
    // (`BadRequestException` if missing) — there's no existing "required on
    // create, optional on edit" zod pattern elsewhere in this codebase to
    // reuse, so this is enforced here rather than in
    // course-editor-form-schema.ts.
    if (!isEditMode && !values.cover) {
      setFormError(t("errors.coverRequired"))
      return
    }

    try {
      if (isEditMode) {
        await updateCourse({
          id: course.id,
          body: {
            title: values.title,
            price: values.price,
            discountPrice: values.discountPrice ?? "",
            description: values.description,
            categoryId: values.categoryId,
            difficultyId: values.difficultyId,
            languageId: values.languageId,
            authorIds: values.authorIds,
            cover: values.cover,
          },
        }).unwrap()
      } else {
        await createCourse({
          title: values.title,
          price: values.price,
          discountPrice: values.discountPrice ? values.discountPrice : undefined,
          description: values.description,
          categoryId: values.categoryId,
          difficultyId: values.difficultyId,
          languageId: values.languageId,
          authorIds: values.authorIds,
          cover: values.cover,
        }).unwrap()
        form.reset(EMPTY_VALUES)
      }
      setSelectedImageName(null)
      onSaved()
    } catch (error) {
      setFormError(getCourseEditorErrorMessage(error, t("errors.generic")))
    }
  }

  return {
    isEditMode,
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading: isCreating || isUpdating,
    isReferenceDataLoading,
    formError,
    selectedImageName,
    onImageChange,
    existingImageUrl: course?.cover ?? null,
    categories,
    authors,
    difficulties,
    languages,
  }
}

export { useCourseEditorForm }
