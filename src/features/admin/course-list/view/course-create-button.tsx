"use client"

import { PlusIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { Button } from "@/components/ui/button"

// The sibling course-editor slice owns the actual create/edit Dialog content
// (react-hook-form + zod + the mutation + reference-data fetching) — loaded
// via next/dynamic (ssr:false) and only mounted while open, same pattern as
// book-create-button.tsx. Sibling slices within the same domain folder reuse
// each other's View components directly (see CLAUDE.md's course-detail/
// course-reviews precedent) rather than each re-implementing the dialog;
// only the model layer stays duplicated/self-contained per slice. The "Add
// course" trigger button itself stays directly in this always-loaded view
// tree, per CLAUDE.md's "don't next/dynamic small, always-visible UI"
// guidance.
const CourseEditorDialog = dynamic(
  () =>
    import("@/features/admin/course-editor/view/course-editor-dialog").then(
      (mod) => mod.CourseEditorDialog
    ),
  { ssr: false }
)

interface CourseCreateButtonProps {
  onSaved: () => void
}

// Header "Add course" trigger — the create-mode entry point into
// course-editor's dialog (edit mode's entry point is course-edit-button.tsx,
// same shared dialog/form per CLAUDE.md's "reuse the same form component"
// note).
function CourseCreateButton({ onSaved }: CourseCreateButtonProps) {
  const t = useTranslations("Admin.courseManagement")
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon />
        {t("createCta")}
      </Button>
      <CourseEditorDialog open={open} onOpenChange={setOpen} onSaved={onSaved} />
    </>
  )
}

export { CourseCreateButton }
