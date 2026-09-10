"use client"

import { useTranslations } from "next-intl"

import { TextField } from "@/components/shared/form/text-field"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authModalOpened } from "@/features/auth/model/auth-slice"
import { CheckoutEmptyCart } from "@/features/commerce/checkout/view/checkout-empty-cart"
import { CheckoutFail } from "@/features/commerce/checkout/view/checkout-fail"
import { CheckoutSignInRequired } from "@/features/commerce/checkout/view/checkout-sign-in-required"
import { CheckoutSuccess } from "@/features/commerce/checkout/view/checkout-success"
import { CheckoutSummaryRow } from "@/features/commerce/checkout/view/checkout-summary-row"
import { useCheckout } from "@/features/commerce/checkout/viewmodel/use-checkout"
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
    return <CheckoutSignInRequired onSignIn={() => dispatch(authModalOpened("sign-in"))} />
  }

  if (step === "success" && order) {
    return <CheckoutSuccess order={order} />
  }

  if (step === "form" && isCartEmpty) {
    return <CheckoutEmptyCart />
  }

  if (step === "fail") {
    return <CheckoutFail errorMessage={errorMessage} onRetry={retry} />
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
              <CheckoutSummaryRow label={t("summary.subtotal")} value={formatPrice(summary.subtotal)} />
              {summary.itemDiscount > 0 && (
                <CheckoutSummaryRow
                  label={t("summary.itemDiscount")}
                  value={`-${formatPrice(summary.itemDiscount)}`}
                />
              )}
              {summary.couponCode && summary.couponDiscount > 0 && (
                <CheckoutSummaryRow
                  label={t("summary.couponDiscount", { code: summary.couponCode })}
                  value={`-${formatPrice(summary.couponDiscount)}`}
                />
              )}
              <CheckoutSummaryRow label={t("summary.deliveryFee")} value={formatPrice(deliveryFee)} />
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

export { CheckoutView }
