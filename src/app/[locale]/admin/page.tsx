import { redirect } from "@/lib/i18n/navigation"
import type { routing } from "@/lib/i18n/routing"

interface AdminIndexPageProps {
  params: Promise<{ locale: (typeof routing.locales)[number] }>
}

// `/admin` itself has no dedicated screen — send visitors to the first
// section every admin (not just superadmin) can actually use. `/admin/roles`
// is superadmin-only and would greet a plain admin with a "not authorized"
// card, so it's a poor landing page despite being first in the sidebar order.
export default async function AdminIndexPage({ params }: AdminIndexPageProps) {
  const { locale } = await params
  redirect({ href: "/admin/news", locale })
}
