"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface CourseDeleteDialogProps {
  title: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading: boolean
}

// Loaded via next/dynamic (ssr:false) from course-delete-button.tsx, same
// reasoning as book-delete-dialog.tsx — a Dialog that isn't visible on
// initial render shouldn't be part of the page's initial bundle.
function CourseDeleteDialog({
  title,
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: CourseDeleteDialogProps) {
  const t = useTranslations("Admin.courseManagement.deleteDialog")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description", { title })}</DialogDescription>
          <div className="mt-2 flex w-full gap-3">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {t("confirm")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { CourseDeleteDialog }
