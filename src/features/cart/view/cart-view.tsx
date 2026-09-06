"use client"

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"
import type { FormEvent } from "react"

import { TextField } from "@/components/shared/text-field"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { authModalOpened } from "@/features/auth/model/auth-slice"
import type { CartItem } from "@/features/cart/model/cart-schemas"
import { useCart } from "@/features/cart/viewmodel/use-cart"
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
    appliedCode,
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
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center">
          <p className="text-sm text-brand-secondary-low">{t("signInRequired")}</p>
          <Button onClick={() => dispatch(authModalOpened("sign-in"))}>{t("signInCta")}</Button>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <CartSkeleton />
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("errors.generic")}
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("empty")}
        </div>
      </div>
    )
  }

  const checkoutHref = appliedCode ? `/checkout?code=${encodeURIComponent(appliedCode)}` : "/checkout"

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
              <SummaryRow label={t("summary.deliveryFee")} value={formatPrice(summary.deliveryFee)} />
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

interface CartItemRowProps {
  item: CartItem
  disabled: boolean
  onIncrease: () => void
  onDecrease: () => void
  onRemove: () => void
}

function CartItemRow({ item, disabled, onIncrease, onDecrease, onRemove }: CartItemRowProps) {
  const t = useTranslations("Cart.item")
  const unitPrice = item.discountPrice ?? item.price

  return (
    <div className="flex gap-4 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4">
      <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden rounded-lg bg-dark-2">
        <Image src={item.cover} alt={item.title} fill sizes="80px" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <h3 className="line-clamp-2 text-sm font-medium text-brand-white">{item.title}</h3>
        <div className="flex items-center gap-2">
          {item.discountPrice ? (
            <>
              <span className="text-sm font-semibold text-brand-white">
                {formatPrice(item.discountPrice)}
              </span>
              <span className="text-xs text-brand-secondary-low line-through">
                {formatPrice(item.price)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-brand-white">{formatPrice(item.price)}</span>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("decrease")}
              disabled={disabled || item.quantity <= 1}
              onClick={onDecrease}
            >
              <MinusIcon />
            </Button>
            <span className="w-6 text-center text-sm text-brand-white">{item.quantity}</span>
            <Button
              variant="outline"
              size="icon-sm"
              aria-label={t("increase")}
              disabled={disabled}
              onClick={onIncrease}
            >
              <PlusIcon />
            </Button>
          </div>
          <span className="text-sm text-brand-secondary-low">
            {formatPrice(unitPrice * item.quantity)}
          </span>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={t("remove")}
            disabled={disabled}
            onClick={onRemove}
          >
            <Trash2Icon />
          </Button>
        </div>
      </div>
    </div>
  )
}

function CartSkeleton() {
  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <Skeleton className="h-8 w-40 rounded-lg" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    </div>
  )
}

export { CartView }
