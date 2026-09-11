"use client"

import Image from "next/image"

import type { NewsAdminItem } from "@/features/admin/news-management/model/news-management-schemas"
import { NewsDeleteButton } from "@/features/admin/news-management/view/news-delete-button"
import { NewsEditButton } from "@/features/admin/news-management/view/news-edit-button"
import { formatDate } from "@/lib/utils"

interface NewsManagementRowProps {
  item: NewsAdminItem
  onSaved: () => void
}

function NewsManagementRow({ item, onSaved }: NewsManagementRowProps) {
  return (
    <div className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-3 sm:grid-cols-[56px_1fr_140px_auto]">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-dark-2">
        {item.imageUrl && <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />}
      </div>
      <span className="line-clamp-2 text-sm text-brand-white">{item.title}</span>
      <span className="hidden text-xs text-brand-secondary-low sm:block">
        {formatDate(item.publishedAt)}
      </span>
      <div className="col-span-3 flex justify-end gap-2 sm:col-span-1">
        <NewsEditButton item={item} onSaved={onSaved} />
        <NewsDeleteButton item={item} onSaved={onSaved} />
      </div>
    </div>
  )
}

export { NewsManagementRow }
