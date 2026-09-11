"use client"

import Image from "next/image"

import type { BookAdminItem } from "@/features/admin/book-list/model/book-list-schemas"
import { BookDeleteButton } from "@/features/admin/book-list/view/book-delete-button"
import { BookEditButton } from "@/features/admin/book-list/view/book-edit-button"
import { formatPrice } from "@/lib/utils"

interface BookListRowProps {
  item: BookAdminItem
  onSaved: () => void
}

function BookListRow({ item, onSaved }: BookListRowProps) {
  return (
    <div className="grid grid-cols-[56px_1fr_auto] items-center gap-3 rounded-xl border border-[#1F272A] bg-[#1A1D1F] p-3 sm:grid-cols-[56px_1fr_120px_auto]">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-dark-2">
        {item.cover && <Image src={item.cover} alt={item.title} fill className="object-cover" />}
      </div>
      <span className="line-clamp-2 text-sm text-brand-white">{item.title}</span>
      <span className="hidden text-xs text-brand-secondary-low sm:block">
        {formatPrice(item.discountPrice ?? item.price)}
      </span>
      <div className="col-span-3 flex justify-end gap-2 sm:col-span-1">
        <BookEditButton item={item} onSaved={onSaved} />
        <BookDeleteButton item={item} onSaved={onSaved} />
      </div>
    </div>
  )
}

export { BookListRow }
