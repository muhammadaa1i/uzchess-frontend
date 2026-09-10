"use client"

import { CheckCircle2Icon } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import type { CheckoutResponse } from "@/features/commerce/checkout/model/checkout-schemas"
import { CheckoutSummaryRow } from "@/features/commerce/checkout/view/checkout-summary-row"
import { Link } from "@/lib/i18n/navigation"
import { formatPrice } from "@/lib/utils"

interface CheckoutSuccessProps {
  order: CheckoutResponse
}

function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  const t = useTranslations("Checkout")

  return (
    <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 px-4 py-16 text-center">
      <CheckCircle2Icon className="size-12 text-brand-green" />
      <h1 className="text-2xl font-medium text-brand-white">{t("success.title")}</h1>
      <p className="text-sm text-brand-secondary-low">{t("success.description")}</p>
      <div className="mt-2 flex w-full flex-col gap-2 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4 text-left text-sm">
        <CheckoutSummaryRow label={t("success.orderNumber")} value={order.orderNumber} />
        <CheckoutSummaryRow label={t("summary.total")} value={formatPrice(order.totalPrice)} />
      </div>
      <Button render={<Link href="/" />} nativeButton={false} className="mt-2 w-full">
        {t("success.backHome")}
      </Button>
    </div>
  )
}

export { CheckoutSuccess }
