"use client"

import { PencilIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import type { CourseAdminItem } from "@/features/admin/course-list/model/course-list-schemas"

// Same next/dynamic(ssr:false)-loaded dialog as course-create-button.tsx
// (owned by the sibling course-editor slice), this time opened in edit mode
// via `course`. `CourseAdminItem` (this slice's own model) and
// course-editor's `CourseEditorItem` are structurally identical duplicates
// of the same backend shape (see course-list-schemas.ts's comment) — passing
// one where the other is expected relies on that structural match, not a
// shared import.
const CourseEditorDialog = dynamic(
  () =>
    import("@/features/admin/course-editor/view/course-editor-dialog").then(
      (mod) => mod.CourseEditorDialog
    ),
  { ssr: false }
)

interface CourseEditButtonProps {
  item: CourseAdminItem
  onSaved: () => void
}

function CourseEditButton({ item, onSaved }: CourseEditButtonProps) {
  const t = useTranslations("Admin.courseManagement")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="secondary"
        size="icon-sm"
        aria-label={t("edit")}
        onClick={() => setOpen(true)}
      >
        <PencilIcon className="size-4" />
      </Button>
      <CourseEditorDialog open={open} onOpenChange={setOpen} course={item} onSaved={onSaved} />
    </>
  )
}

export { CourseEditButton }
