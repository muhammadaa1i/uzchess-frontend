"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useOrders } from "@/features/profile/viewmodel/use-orders"
import { Link } from "@/lib/i18n/navigation"
import { formatDate, formatPrice } from "@/lib/utils"

const STATUS_BADGE_VARIANT = {
  processing: "secondary",
  delivered: "default",
  cancelled: "destructive",
} as const

// "Orders" tab — GET /orders. Per CLAUDE.md's terminology note, this is the
// "purchased products" (books) list — books are bought via /cart ->
// /orders/checkout, not a separate "product" entity, so each order's line
// items link straight into the Library book detail route.
function ProfileOrdersSection() {
  const t = useTranslations("Profile.orders")
  const { orders, isLoading, isError } = useOrders()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError || orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
        {t("empty")}
        <Button size="sm" render={<Link href="/library" />} nativeButton={false}>
          {t("browseCta")}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <div
          key={order.id}
          className="flex flex-col gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-brand-white">
                {t("orderNumber", { id: order.id })}
              </span>
              <Badge variant={STATUS_BADGE_VARIANT[order.status]}>
                {t(`status.${order.status}`)}
              </Badge>
            </div>
            <span className="text-xs text-brand-secondary-low">{formatDate(order.createdAt)}</span>
          </div>

          <div className="flex flex-wrap gap-3">
            {order.items.map((item) => (
              <Link
                key={item.bookId}
                href={`/library/${item.bookId}`}
                className="flex items-center gap-2 rounded-lg bg-dark-2 p-2 transition-colors hover:bg-[#202426]"
              >
                <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-dark">
                  <Image src={item.cover} alt={item.title} fill className="object-cover" />
                </div>
                <span className="line-clamp-2 max-w-[160px] text-xs text-brand-white">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#1F272A] pt-3">
            <span className="text-xs text-brand-secondary-low">
              {t("itemsLabel", { count: order.items.length })}
            </span>
            <span className="text-sm font-semibold text-brand-white">
              {formatPrice(order.totalPrice)}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export { ProfileOrdersSection }
