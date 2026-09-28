"use client"

import { CheckCircle2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface PurchaseModalSuccessProps {
  onClose: () => void
}

function PurchaseModalSuccess({ onClose }: PurchaseModalSuccessProps) {
  const t = useTranslations("Courses.purchase")

  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <CheckCircle2Icon className="size-10 text-brand-green" />
      <DialogTitle>{t("success.title")}</DialogTitle>
      <DialogDescription>{t("success.description")}</DialogDescription>
      <Button className="mt-2 w-full" onClick={onClose}>
        {t("success.close")}
      </Button>
    </div>
  )
}

export { PurchaseModalSuccess }
