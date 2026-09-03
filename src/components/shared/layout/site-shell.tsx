import type { ReactNode } from "react"

import { SiteHeader } from "@/components/shared/layout/site-header"
import { SiteFooter } from "@/components/shared/layout/site-footer"
import { MobileTabBar } from "@/components/shared/layout/mobile-tab-bar"

function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />
      <main className="flex-1 pb-16 lg:pb-0">{children}</main>
      <div className="hidden lg:block">
        <SiteFooter />
      </div>
      <MobileTabBar />
    </div>
  )
}

export { SiteShell }
