"use client"

import { CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"
import { Controller } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Field, FieldLabel } from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { purchaseProviderSchema } from "@/features/courses/model/course-schemas"
import { useCoursePurchase } from "@/features/courses/viewmodel/use-course-purchase"

const PROVIDERS = purchaseProviderSchema.options

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
  const t = useTranslations("Courses.purchase")
  const { step, errorMessage, form, onSubmit, isLoading, retry } = useCoursePurchase(
    courseId,
    onPurchased
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {step === "form" && (
          <div className="flex flex-col gap-4">
            <DialogTitle>{t("title")}</DialogTitle>
            <DialogDescription>{t("description")}</DialogDescription>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <Controller
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <Field>
                    <FieldLabel>{t("providerLabel")}</FieldLabel>
                    <RadioGroup value={field.value} onValueChange={field.onChange}>
                      {PROVIDERS.map((provider) => (
                        <FieldLabel key={provider} htmlFor={`provider-${provider}`}>
                          <Field orientation="horizontal">
                            <RadioGroupItem value={provider} id={`provider-${provider}`} />
                            {t(`providers.${provider}`)}
                          </Field>
                        </FieldLabel>
                      ))}
                    </RadioGroup>
                  </Field>
                )}
              />
              <Button type="submit" disabled={isLoading} className="mt-2">
                {t("submit")}
              </Button>
            </form>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2Icon className="size-10 text-brand-green" />
            <DialogTitle>{t("success.title")}</DialogTitle>
            <DialogDescription>{t("success.description")}</DialogDescription>
            <Button className="mt-2 w-full" onClick={() => onOpenChange(false)}>
              {t("success.close")}
            </Button>
          </div>
        )}

        {step === "fail" && (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <XCircleIcon className="size-10 text-destructive" />
            <DialogTitle>{t("fail.title")}</DialogTitle>
            {errorMessage && <DialogDescription>{errorMessage}</DialogDescription>}
            <Button className="mt-2 w-full" onClick={retry}>
              {t("fail.retry")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { PurchaseModal }
