"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { PurchaseModalFail } from "@/features/course-detail/view/purchase-modal-fail"
import { PurchaseModalForm } from "@/features/course-detail/view/purchase-modal-form"
import { PurchaseModalSuccess } from "@/features/course-detail/view/purchase-modal-success"
import { useCoursePurchase } from "@/features/course-detail/viewmodel/use-course-purchase"

interface PurchaseModalProps {
  courseId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onPurchased?: () => void
}

// Loaded via next/dynamic (ssr:false) from course-detail-view.tsx and only
// ever mounted while `open` is true — the "Buy course" trigger button itself
// stays in the always-loaded parent so it's never gated on this chunk (see
// CLAUDE.md: don't next/dynamic "small, always-visible UI", do it for
// "modals/dialogs that aren't visible on initial render").
function PurchaseModal({ courseId, open, onOpenChange, onPurchased }: PurchaseModalProps) {
  const { step, errorMessage, form, onSubmit, isLoading, retry } = useCoursePurchase(
    courseId,
    onPurchased
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {step === "form" && <PurchaseModalForm form={form} onSubmit={onSubmit} isLoading={isLoading} />}
        {step === "success" && <PurchaseModalSuccess onClose={() => onOpenChange(false)} />}
        {step === "fail" && <PurchaseModalFail errorMessage={errorMessage} onRetry={retry} />}
      </DialogContent>
    </Dialog>
  )
}

export { PurchaseModal }
