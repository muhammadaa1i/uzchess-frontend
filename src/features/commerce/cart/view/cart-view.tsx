"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import type { FormEvent } from "react"

import { TextField } from "@/components/shared/form/text-field"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authModalOpened } from "@/features/auth/model/auth-slice"
import { CartEmptyState } from "@/features/commerce/cart/view/cart-empty-state"
import { CartErrorState } from "@/features/commerce/cart/view/cart-error-state"
import { CartItemRow } from "@/features/commerce/cart/view/cart-item-row"
import { CartSignInRequired } from "@/features/commerce/cart/view/cart-sign-in-required"
import { CartSkeleton } from "@/features/commerce/cart/view/cart-skeleton"
import { CartSummaryRow } from "@/features/commerce/cart/view/cart-summary-row"
import { useCart } from "@/features/commerce/cart/viewmodel/use-cart"
import { Link } from "@/lib/i18n/navigation"
import { useAppDispatch } from "@/lib/store/hooks"
import { formatPrice } from "@/lib/utils"

// Cart page — CLAUDE.md section 10: line items, quantity picker
// (PATCH /cart/update/{id}, DELETE /cart/remove/{id}), totals, discount,
// coupon. Coupon application is client-only via GET /cart/summary?code=
// (see use-cart.ts) — there's no separate "validate coupon" endpoint on the
// live backend, /coupons/read is an admin listing endpoint, not a
// per-code customer-facing validator.
function CartView() {
  const t = useTranslations("Cart")
  const dispatch = useAppDispatch()
  const [couponInput, setCouponInput] = useState("")
  const {
    isAuthenticated,
    items,
    isLoading,
    isError,
    summary,
    isSummaryLoading,
    checkoutHref,
    couponError,
    applyCoupon,
    changeQuantity,
    removeFromCart,
    isMutating,
    mutationError,
  } = useCart()

  function handleApplyCoupon(event: FormEvent) {
    event.preventDefault()
    if (couponInput.trim()) {
      applyCoupon(couponInput)
    }
  }

  if (!isAuthenticated) {
    return <CartSignInRequired onSignIn={() => dispatch(authModalOpened("sign-in"))} />
  }

  if (isLoading) {
    return <CartSkeleton />
  }

  if (isError) {
    return <CartErrorState />
  }

  if (items.length === 0) {
    return <CartEmptyState />
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              disabled={isMutating}
              onIncrease={() => changeQuantity(item.id, item.quantity + 1)}
              onDecrease={() => changeQuantity(item.id, item.quantity - 1)}
              onRemove={() => removeFromCart(item.id)}
            />
          ))}
          {mutationError && <p className="text-sm text-destructive">{mutationError}</p>}
        </div>

        <div className="flex h-fit flex-col gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-5">
          <h2 className="text-sm font-medium text-brand-white">{t("summary.title")}</h2>

          <form onSubmit={handleApplyCoupon} className="flex items-end gap-2">
            <TextField
              label={t("coupon.label")}
              placeholder={t("coupon.placeholder")}
              value={couponInput}
              onChange={(event) => setCouponInput(event.target.value)}
              className="flex-1"
            />
            <Button type="submit" variant="secondary">
              {t("coupon.apply")}
            </Button>
          </form>
          {couponError && <p className="text-sm text-destructive">{couponError}</p>}

          {isSummaryLoading || !summary ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="h-4 w-full rounded" />
              ))}
            </div>
          ) : (
            <>
              <CartSummaryRow label={t("summary.subtotal")} value={formatPrice(summary.subtotal)} />
              {summary.itemDiscount > 0 && (
                <CartSummaryRow
                  label={t("summary.itemDiscount")}
                  value={`-${formatPrice(summary.itemDiscount)}`}
                />
              )}
              {summary.couponCode && summary.couponDiscount > 0 && (
                <CartSummaryRow
                  label={t("summary.couponDiscount", { code: summary.couponCode })}
                  value={`-${formatPrice(summary.couponDiscount)}`}
                />
              )}
              <CartSummaryRow label={t("summary.deliveryFee")} value={formatPrice(summary.deliveryFee)} />
              <div className="mt-1 flex items-center justify-between border-t border-[#1F272A] pt-3 text-base font-semibold text-brand-white">
                <span>{t("summary.total")}</span>
                <span>{formatPrice(summary.total)}</span>
              </div>
            </>
          )}

          <Button render={<Link href={checkoutHref} />} nativeButton={false} className="mt-2 w-full">
            {t("checkoutCta")}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { CartView }
