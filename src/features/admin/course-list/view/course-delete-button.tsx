"use client"

import { Trash2Icon } from "lucide-react"
import dynamic from "next/dynamic"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import type { CourseAdminItem } from "@/features/admin/course-list/model/course-list-schemas"
import { useDeleteCourse } from "@/features/admin/course-list/viewmodel/use-delete-course"

// The Dialog's content (per CLAUDE.md's next/dynamic guidance for anything
// not visible on initial render) is loaded via next/dynamic(ssr:false) —
// only this trigger button stays in the always-loaded row, same split as
// book-delete-button.tsx.
const CourseDeleteDialog = dynamic(
  () =>
    import("@/features/admin/course-list/view/course-delete-dialog").then(
      (mod) => mod.CourseDeleteDialog
    ),
  { ssr: false }
)

interface CourseDeleteButtonProps {
  item: CourseAdminItem
  onSaved: () => void
}

function CourseDeleteButton({ item, onSaved }: CourseDeleteButtonProps) {
  const t = useTranslations("Admin.courseManagement")
  const { open, setOpen, confirmDelete, isLoading } = useDeleteCourse({
    courseId: item.id,
    onDeleted: onSaved,
  })

  return (
    <>
      <Button
        variant="destructive"
        size="icon-sm"
        aria-label={t("delete")}
        onClick={() => setOpen(true)}
      >
        <Trash2Icon className="size-4" />
      </Button>
      <CourseDeleteDialog
        title={item.title}
        open={open}
        onOpenChange={setOpen}
        onConfirm={confirmDelete}
        isLoading={isLoading}
      />
    </>
  )
}

export { CourseDeleteButton }
