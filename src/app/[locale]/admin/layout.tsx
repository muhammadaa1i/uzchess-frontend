"use client"

import { useEffect } from "react"

import { AdminSidebarNav } from "@/features/admin/admin-shell/view/admin-sidebar-nav"
import { authModalOpened } from "@/features/auth/model/auth-slice"
import { useAdminAccess } from "@/features/auth/viewmodel/use-admin-access"
import { useRouter } from "@/lib/i18n/navigation"
import { useAppDispatch } from "@/lib/store/hooks"

// Gates every /admin/* route. Client-side only — the backend's @Roles()
// guard is the real security boundary, this just decides what to render.
// Must wait for redux-persist rehydration (see auth-selectors.ts) before
// deciding, or an already-logged-in admin gets bounced on every refresh.
// `redirect()` from next-intl's navigation is server-component-only (it
// throws NEXT_REDIRECT); client components use useRouter(), same as
// site-header.tsx's LanguageSwitcher.
function AdminLayout({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { isRehydrated, isAuthenticated, isAdmin } = useAdminAccess()

  useEffect(() => {
    if (!isRehydrated) return

    if (!isAuthenticated) {
      dispatch(authModalOpened("sign-in"))
      router.replace("/")
      return
    }

    if (!isAdmin) {
      router.replace("/")
    }
  }, [isRehydrated, isAuthenticated, isAdmin, dispatch, router])

  if (!isRehydrated || !isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:flex-row lg:px-6 lg:py-10">
      <AdminSidebarNav />
      <div className="w-full">{children}</div>
    </div>
  )
}

export default AdminLayout
