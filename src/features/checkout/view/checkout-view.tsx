"use client"

import { CheckCircle2Icon, XCircleIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { TextField } from "@/components/shared/text-field"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authModalOpened } from "@/features/auth/model/auth-slice"
import { useCheckout } from "@/features/checkout/viewmodel/use-checkout"
import { Link } from "@/lib/i18n/navigation"
import { useAppDispatch } from "@/lib/store/hooks"
import { formatPrice } from "@/lib/utils"

interface CheckoutViewProps {
  couponCode?: string
}

// Checkout page — CLAUDE.md section 10: shipping/contact form (shipping cost
// read from GET /cart/summary's deliveryFee/total — see use-checkout.ts for
// why GET /delivery-setting itself isn't used), place order via
// POST /orders/checkout, plus an order-success state. Modeled as a
// single-page step machine ("form" ->
// "success" | "fail") rather than a separate /checkout/success route, same
// pattern Courses' purchase-modal already uses for the analogous
// buy-then-confirm flow.
function CheckoutView({ couponCode }: CheckoutViewProps) {
  const t = useTranslations("Checkout")
  const dispatch = useAppDispatch()
  const {
    isAuthenticated,
    summary,
    deliveryFee,
    total,
    isSummaryLoading,
    isCartEmpty,
    form,
    onSubmit,
    isSubmitting,
    step,
    order,
    errorMessage,
    retry,
  } = useCheckout(couponCode)

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
          <p className="text-sm text-brand-secondary-low">{t("signInRequired")}</p>
          <Button onClick={() => dispatch(authModalOpened("sign-in"))}>{t("signInCta")}</Button>
        </div>
      </div>
    )
  }

  if (step === "success" && order) {
    return (
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 px-4 py-16 text-center">
        <CheckCircle2Icon className="size-12 text-brand-green" />
        <h1 className="text-2xl font-medium text-brand-white">{t("success.title")}</h1>
        <p className="text-sm text-brand-secondary-low">{t("success.description")}</p>
        <div className="mt-2 flex w-full flex-col gap-2 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4 text-left text-sm">
          <SummaryRow label={t("success.orderNumber")} value={order.orderNumber} />
          <SummaryRow label={t("summary.total")} value={formatPrice(order.totalPrice)} />
        </div>
        <Button render={<Link href="/" />} nativeButton={false} className="mt-2 w-full">
          {t("success.backHome")}
        </Button>
      </div>
    )
  }

  // Direct navigation to /checkout with nothing in the cart (or after the
  // cart was emptied in another tab) — the backend rejects a checkout
  // submission for an empty cart with a 404, so show this up front instead
  // of a fully interactive form that can only ever fail on submit.
  if (step === "form" && isCartEmpty) {
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

  if (step === "fail") {
    return (
      <div className="mx-auto flex max-w-[560px] flex-col items-center gap-3 px-4 py-16 text-center">
        <XCircleIcon className="size-12 text-destructive" />
        <h1 className="text-2xl font-medium text-brand-white">{t("fail.title")}</h1>
        {errorMessage && <p className="text-sm text-brand-secondary-low">{errorMessage}</p>}
        <Button className="mt-2 w-full" onClick={retry}>
          {t("fail.retry")}
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-5"
        >
          <TextField
            label={t("form.fullName")}
            autoComplete="name"
            errors={[form.formState.errors.fullName]}
            {...form.register("fullName")}
          />
          <TextField
            label={t("form.phone")}
            variant="phone"
            autoComplete="tel"
            errors={[form.formState.errors.phone]}
            {...form.register("phone")}
          />
          <TextField
            label={t("form.email")}
            autoComplete="email"
            errors={[form.formState.errors.email]}
            {...form.register("email")}
          />
          <Button type="submit" disabled={isSubmitting} className="mt-2">
            {t("form.submit")}
          </Button>
        </form>

        <div className="flex h-fit flex-col gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-5">
          <h2 className="text-sm font-medium text-brand-white">{t("summary.title")}</h2>
          {isSummaryLoading || !summary ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-full rounded" />
              ))}
            </div>
          ) : (
            <>
              <SummaryRow label={t("summary.subtotal")} value={formatPrice(summary.subtotal)} />
              {summary.itemDiscount > 0 && (
                <SummaryRow
                  label={t("summary.itemDiscount")}
                  value={`-${formatPrice(summary.itemDiscount)}`}
                />
              )}
              {summary.couponCode && summary.couponDiscount > 0 && (
                <SummaryRow
                  label={t("summary.couponDiscount", { code: summary.couponCode })}
                  value={`-${formatPrice(summary.couponDiscount)}`}
                />
              )}
              <SummaryRow label={t("summary.deliveryFee")} value={formatPrice(deliveryFee)} />
              <div className="mt-1 flex items-center justify-between border-t border-[#1F272A] pt-3 text-base font-semibold text-brand-white">
                <span>{t("summary.total")}</span>
                <span>{formatPrice(total ?? 0)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

interface SummaryRowProps {
  label: string
  value: string
}

function SummaryRow({ label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between text-sm text-brand-secondary-low">
      <span>{label}</span>
      <span className="text-brand-white">{value}</span>
    </div>
  )
}

export { CheckoutView }
