"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon, ChevronDownIcon, LogInIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const NAV_LINKS = [
  { href: "/", label: "Asosiy" },
  { href: "/news", label: "Yangiliklar" },
  { href: "/courses", label: "Kurslar" },
  { href: "/library", label: "Kutubxona" },
  { href: "/contact", label: "Bog'lanish" },
] as const

const LANGUAGES = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
] as const

interface SiteHeaderUser {
  name: string
  avatarUrl?: string
}

interface SiteHeaderProps {
  user?: SiteHeaderUser | null
  onSignInClick?: () => void
  className?: string
}

function SiteHeader({ user = null, onSignInClick, className }: SiteHeaderProps) {
  const pathname = usePathname()

  return (
    <header className={cn("sticky top-0 z-40 lg:top-5", className)}>
      {/* Mobile: compact bar, nav lives in the bottom TabBar instead */}
      <div className="flex items-center justify-between border-b border-border bg-dark px-4 py-3 lg:hidden">
        <Link href="/" className="shrink-0">
          <Image
            src="/brand/logo-header.svg"
            alt="UzChess"
            width={104}
            height={40}
            priority
            className="h-7 w-auto"
          />
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" aria-label="Qidiruv">
            <SearchIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Bildirishnomalar">
            <BellIcon />
          </Button>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button size="sm" onClick={onSignInClick}>
              Kirish
            </Button>
          )}
        </div>
      </div>

      {/* Desktop: full header with centered nav */}
      <div
        className={cn(
          "mx-auto hidden w-full max-w-[1376px] items-center justify-between gap-6 rounded-2xl border border-[#272B30] bg-dark px-6 py-[18px] lg:flex"
        )}
      >
        <div className="flex items-center gap-6">
          <Link href="/" className="shrink-0">
            <Image
              src="/brand/logo-header.svg"
              alt="UzChess"
              width={104}
              height={40}
              priority
              className="h-8 w-auto"
            />
          </Link>
          <Separator orientation="vertical" className="h-6" />
          <LanguageSwitcher />
        </div>

        <nav className="flex items-center gap-10">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative pb-2 text-sm font-medium text-brand-white/70 transition-colors hover:text-brand-white",
                  isActive && "text-brand-white"
                )}
              >
                {link.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-primary shadow-[0_1px_10px_rgba(28,146,224,0.3)]" />
                )}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-5">
          <Button variant="ghost" size="icon-sm" aria-label="Qidiruv">
            <SearchIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Bildirishnomalar">
            <BellIcon />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button onClick={onSignInClick}>
              Kirish
              <LogInIcon />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function LanguageSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-brand-white outline-none">
        O&apos;zbekcha
        <ChevronDownIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {LANGUAGES.map((language) => (
          <DropdownMenuItem key={language.code}>{language.label}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu({ user }: { user: SiteHeaderUser }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar size="sm">
          <AvatarImage src={user.avatarUrl} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profil</DropdownMenuItem>
        <DropdownMenuItem>Chiqish</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { SiteHeader }
export type { SiteHeaderProps, SiteHeaderUser }
