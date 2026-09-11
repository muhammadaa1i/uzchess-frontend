"use client"

import { useTranslations } from "next-intl"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import type { CourseEditorItem } from "@/features/admin/course-editor/model/course-editor-schemas"
import { CourseEditorForm } from "@/features/admin/course-editor/view/course-editor-form"
import { useCourseEditorForm } from "@/features/admin/course-editor/viewmodel/use-course-editor-form"

interface CourseEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  course?: CourseEditorItem
  onSaved: () => void
}

// Shared create/edit Dialog — the sibling course-list slice's
// course-create-button.tsx opens it with no `course` (POST
// /courses/create), course-edit-button.tsx opens it with one (PATCH
// /courses/update/{id}), same "one dialog, two triggers" reuse as
// book-editor-dialog.tsx. Loaded via next/dynamic (ssr:false) from both
// triggers and only ever mounted while `open` is true — see course-list's
// course-create-button.tsx/course-edit-button.tsx.
function CourseEditorDialog({ open, onOpenChange, course, onSaved }: CourseEditorDialogProps) {
  const t = useTranslations("Admin.courseManagement.form")
  const {
    isEditMode,
    form,
    onSubmit,
    isLoading,
    isReferenceDataLoading,
    formError,
    selectedImageName,
    onImageChange,
    existingImageUrl,
    categories,
    authors,
    difficulties,
    languages,
  } = useCourseEditorForm({
    course,
    open,
    onSaved: () => {
      onOpenChange(false)
      onSaved()
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <CourseEditorForm
          title={isEditMode ? t("editTitle") : t("createTitle")}
          form={form}
          onSubmit={onSubmit}
          isLoading={isLoading}
          isReferenceDataLoading={isReferenceDataLoading}
          formError={formError}
          selectedImageName={selectedImageName}
          existingImageUrl={existingImageUrl}
          onImageChange={onImageChange}
          submitLabel={isEditMode ? t("submitEdit") : t("submitCreate")}
          categories={categories}
          authors={authors}
          difficulties={difficulties}
          languages={languages}
        />
      </DialogContent>
    </Dialog>
  )
}

export { CourseEditorDialog }
