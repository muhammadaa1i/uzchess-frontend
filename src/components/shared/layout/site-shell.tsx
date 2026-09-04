
import type { ReactNode } from "react"

import { MobileTabBar } from "@/components/shared/layout/mobile-tab-bar"
import { SiteFooter } from "@/components/shared/layout/site-footer"
import { SiteHeader } from "@/components/shared/layout/site-header"
import { TestModeBanner } from "@/components/shared/layout/test-mode-banner"
import { AuthModal } from "@/features/auth/view/auth-modal"

function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <TestModeBanner />
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <div className="hidden lg:block">
        <SiteFooter />
      </div>
      <MobileTabBar />
      <AuthModal />
    </div>
  )
}

export { SiteShell }
