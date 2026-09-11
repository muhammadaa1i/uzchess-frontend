"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { Badge } from "@/components/ui/badge"
import type { BannerAdminItem } from "@/features/admin/banner-management/model/banner-management-schemas"
import { BannerDeleteButton } from "@/features/admin/banner-management/view/banner-delete-button"
import { BannerEditButton } from "@/features/admin/banner-management/view/banner-edit-button"

interface BannerManagementRowProps {
  item: BannerAdminItem
  onSaved: () => void
}

function BannerManagementRow({ item, onSaved }: BannerManagementRowProps) {
  const t = useTranslations("Admin.bannerManagement")

  return (
    <div className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-3 sm:grid-cols-[56px_1fr_120px_auto]">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-dark-2">
        {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />}
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="line-clamp-1 text-sm text-brand-white">{item.title}</span>
        {item.subtitle && (
          <span className="line-clamp-1 text-xs text-brand-secondary-low">{item.subtitle}</span>
        )}
      </div>
      <div className="hidden sm:block">
        <Badge variant={item.isActive ? "secondary" : "outline"}>
          {item.isActive ? t("status.active") : t("status.inactive")}
        </Badge>
      </div>
      <div className="col-span-3 flex justify-end gap-2 sm:col-span-1">
        <BannerEditButton item={item} onSaved={onSaved} />
        <BannerDeleteButton item={item} onSaved={onSaved} />
      </div>
    </div>
  )
}

export { BannerManagementRow }
