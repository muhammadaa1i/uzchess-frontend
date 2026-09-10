"use client"

import { MinusIcon, PlusIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import type { CartItem } from "@/features/commerce/cart/model/cart-schemas"
import { formatPrice } from "@/lib/utils"

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

export { CartItemRow }
