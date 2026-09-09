"use client"

import { XCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface PurchaseModalFailProps {
  errorMessage: string | null
  onRetry: () => void
}

function PurchaseModalFail({ errorMessage, onRetry }: PurchaseModalFailProps) {
  const t = useTranslations("Courses.purchase")

  return (
    <div className="flex flex-col items-center gap-3 py-4 text-center">
      <XCircleIcon className="size-10 text-destructive" />
      <DialogTitle>{t("fail.title")}</DialogTitle>
      {errorMessage && <DialogDescription>{errorMessage}</DialogDescription>}
      <Button className="mt-2 w-full" onClick={onRetry}>
        {t("fail.retry")}
      </Button>
    </div>
  )
}

export { PurchaseModalFail }
