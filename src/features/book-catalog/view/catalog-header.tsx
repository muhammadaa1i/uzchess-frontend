"use client"

import { HomeIcon, LibraryIcon, SearchIcon } from "lucide-react"
import { useTranslations } from "next-intl"

import { TextField } from "@/components/shared/form/text-field"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Link } from "@/lib/i18n/navigation"

interface CatalogHeaderProps {
  searchInput: string
  onSearchChange: (value: string) => void
}

function CatalogHeader({ searchInput, onSearchChange }: CatalogHeaderProps) {
  const t = useTranslations("Library")
  const tNav = useTranslations("Nav")

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />} className="flex items-center gap-1.5">
              <HomeIcon className="size-4" />
              {tNav("home")}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("title")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
        <div className="flex w-full shrink-0 items-center justify-center gap-3 rounded-lg border border-[#1F272A] bg-dark px-6 py-5 lg:w-[326px]">
          <LibraryIcon aria-hidden className="size-11 shrink-0 text-brand-white" />
          <h1 className="text-[32px] leading-tight font-bold text-brand-white">{t("title")}</h1>
        </div>

        <div className="relative flex h-[52px] w-full items-center rounded-lg border border-[#232627] bg-[#15181A] px-4">
          <SearchIcon
            aria-hidden
            className="pointer-events-none absolute left-4 size-5 text-brand-white/40"
          />
          <TextField
            placeholder={t("filters.searchPlaceholder")}
            value={searchInput}
            onChange={(event) => onSearchChange(event.target.value)}
            className="h-full border-none bg-transparent pl-8 text-sm text-brand-white shadow-none placeholder:text-brand-white/40 focus-visible:ring-0"
          />
        </div>
      </div>
    </>
  )
}

export { CatalogHeader }
