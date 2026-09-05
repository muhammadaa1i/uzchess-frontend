"use client"

import { LockIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Link } from "@/lib/i18n/navigation"

interface NextLessonLockedModalProps {
  courseId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Loaded via next/dynamic (ssr:false) from lesson-view.tsx, only mounted
// while `open` is true (see purchase-modal.tsx for the same reasoning).
function NextLessonLockedModal({ courseId, open, onOpenChange }: NextLessonLockedModalProps) {
  const t = useTranslations("Courses.lesson.nextLocked")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <LockIcon className="size-10 text-brand-secondary-low" />
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
          <Button
            render={<Link href={`/courses/${courseId}`} />}
            nativeButton={false}
            className="mt-2 w-full"
          >
            {t("cta")}
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => onOpenChange(false)}>
            {t("close")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { NextLessonLockedModal }
