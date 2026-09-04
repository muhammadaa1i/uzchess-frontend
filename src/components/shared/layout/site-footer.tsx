import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link } from "@/lib/i18n/navigation"

const SOCIAL_LINKS = [
  { href: "https://instagram.com", label: "Instagram", icon: "instagram" },
  { href: "https://t.me", label: "Telegram", icon: "telegram" },
  { href: "https://youtube.com", label: "YouTube", icon: "youtube" },
  { href: "https://twitter.com", label: "Twitter", icon: "twitter" },
  { href: "https://facebook.com", label: "Facebook", icon: "facebook" },
] as const

function SiteFooter() {
  const t = useTranslations("Footer")

  const footerLinks = [
    { href: "/about", label: t("about") },
    { href: "/terms", label: t("terms") },
    { href: "/cookie-policy", label: t("cookiePolicy") },
  ] as const

  return (
    <footer className="bg-dark">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-6 px-8 py-10">
        <Link href="/">
          <Image
            src="/brand/logo-footer.svg"
            alt="UzChess"
            width={117}
            height={40}
            className="h-8 w-auto"
          />
        </Link>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-brand-white hover:text-brand-white/80"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.icon}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
            >
              <Image
                src={`/social/${social.icon}.png`}
                alt=""
                width={20}
                height={20}
              />
            </a>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-4 px-8 py-4 text-sm text-brand-white">
          <span>{t("copyright")}</span>
          <Link href="/terms" className="hover:text-brand-white/80">
            {t("terms")}
          </Link>
        </div>
      </div>
    </footer>
  )
}

export { SiteFooter }
