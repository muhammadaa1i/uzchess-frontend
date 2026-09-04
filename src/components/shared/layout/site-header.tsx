"use client"

import { BellIcon, ChevronDownIcon, LogInIcon, SearchIcon } from "lucide-react"
import Image from "next/image"
import { useLocale, useTranslations } from "next-intl"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { useLogoutMutation } from "@/features/auth/model/auth-api"
import type { AuthUser } from "@/features/auth/model/auth-schemas"
import { authModalOpened, loggedOut } from "@/features/auth/model/auth-slice"
import { Link, usePathname, useRouter } from "@/lib/i18n/navigation"
import type { routing } from "@/lib/i18n/routing"
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks"
import { cn } from "@/lib/utils"

type Locale = (typeof routing.locales)[number]

const LANGUAGES: Array<{ code: Locale; label: string }> = [
  { code: "uz", label: "O'zbekcha" },
  { code: "ru", label: "Русский" },
  { code: "en", label: "English" },
]

interface SiteHeaderProps {
  className?: string
}

function SiteHeader({ className }: SiteHeaderProps) {
  const t = useTranslations("Nav")
  const tHeader = useTranslations("Header")
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.auth.user)
  const pathname = usePathname()
  const onSignInClick = () => dispatch(authModalOpened("sign-in"))

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/news", label: t("news") },
    { href: "/courses", label: t("courses") },
    { href: "/library", label: t("library") },
    { href: "/contact", label: t("contact") },
  ] as const

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
          <Button variant="ghost" size="icon-sm" aria-label={tHeader("search")}>
            <SearchIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={tHeader("notifications")}>
            <BellIcon />
          </Button>
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button size="sm" onClick={onSignInClick}>
              {tHeader("signIn")}
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
          {navLinks.map((link) => {
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
          <Button variant="ghost" size="icon-sm" aria-label={tHeader("search")}>
            <SearchIcon />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={tHeader("notifications")}>
            <BellIcon />
          </Button>
          <Separator orientation="vertical" className="h-6" />
          {user ? (
            <UserMenu user={user} />
          ) : (
            <Button onClick={onSignInClick}>
              {tHeader("signIn")}
              <LogInIcon />
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const current = LANGUAGES.find((language) => language.code === locale) ?? LANGUAGES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 text-sm font-medium text-brand-white outline-none">
        {current.label}
        <ChevronDownIcon className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => router.replace(pathname, { locale: language.code })}
          >
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function UserMenu({ user }: { user: AuthUser }) {
  const t = useTranslations("Header")
  const dispatch = useAppDispatch()
  const [logout] = useLogoutMutation()
  const name = `${user.firstName} ${user.lastName}`

  async function handleLogout() {
    // Log out client-side regardless of whether the server call succeeds —
    // an expired/already-invalid token shouldn't leave the user stuck
    // "logged in" on the client.
    try {
      await logout().unwrap()
    } finally {
      dispatch(loggedOut())
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <Avatar size="sm">
          <AvatarImage src={user.avatar ?? undefined} alt={name} />
          <AvatarFallback>{user.firstName.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>{t("profile")}</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>{t("logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { SiteHeader }
export type { SiteHeaderProps }
