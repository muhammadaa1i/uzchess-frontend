"use client"

import { XCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"

interface CheckoutFailProps {
  errorMessage: string | null
  onRetry: () => void
}

function CheckoutFail({ errorMessage, onRetry }: CheckoutFailProps) {
  const t = useTranslations("Checkout")

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 px-4 py-16 text-center">
      <XCircleIcon className="size-12 text-destructive" />
      <h1 className="text-2xl font-medium text-brand-white">{t("fail.title")}</h1>
      {errorMessage && <p className="text-sm text-brand-secondary-low">{errorMessage}</p>}
      <Button className="mt-2 w-full" onClick={onRetry}>
        {t("fail.retry")}
      </Button>
    </div>
  )
}

export { CheckoutFail }
