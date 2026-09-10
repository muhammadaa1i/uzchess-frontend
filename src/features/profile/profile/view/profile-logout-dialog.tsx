"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface ProfileLogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading: boolean
}

// Loaded via next/dynamic (ssr:false) from profile-logout-button.tsx, same
// reasoning as course-detail's purchase-modal.tsx — a Dialog that isn't
// visible on initial render shouldn't be part of the page's initial bundle.
function ProfileLogoutDialog({ open, onOpenChange, onConfirm, isLoading }: ProfileLogoutDialogProps) {
  const t = useTranslations("Profile.logout")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
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

export { ProfileLogoutDialog }
