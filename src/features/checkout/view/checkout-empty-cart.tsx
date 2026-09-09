"use client"

import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"

// Direct navigation to /checkout with nothing in the cart (or after the
// cart was emptied in another tab) — the backend rejects a checkout
// submission for an empty cart with a 404, so show this up front instead
// of a fully interactive form that can only ever fail on submit.
function CheckoutEmptyCart() {
  const t = useTranslations("Checkout")

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
        <p className="text-sm text-brand-secondary-low">{t("empty")}</p>
        <Button render={<Link href="/cart" />} nativeButton={false}>
          {t("goToCart")}
        </Button>
      </div>
    </div>
  )
}

export { CheckoutEmptyCart }
