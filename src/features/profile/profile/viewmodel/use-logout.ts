import { useState } from "react"

import { useLogoutMutation } from "@/features/auth/model/auth-api"
import { loggedOut } from "@/features/auth/model/auth-slice"
import { useAppDispatch } from "@/lib/store/hooks"

// Backs the in-page "Chiqish" confirmation dialog on the General settings
// tab (Figma's third "Profile" frame — a distinct state from the other two,
// see CLAUDE.md's Ambiguities note). Same POST /auth/logout + `loggedOut`
// dispatch as SiteHeader's UserMenu.handleLogout
// (@/components/shared/layout/site-header.tsx), duplicated here rather than
// shared since that's a cross-cutting layout component, not a feature this
// one can import from — auth's session actions are the one deliberately
// shared exception to the code-splitting mandate (see profile-api.ts's
// identical note on userUpdated).
function useLogout() {
  const dispatch = useAppDispatch()
  const [logout, { isLoading }] = useLogoutMutation()
  const [open, setOpen] = useState(false)

  async function confirmLogout() {
    try {
      await logout().unwrap()
    } finally {
      dispatch(loggedOut())
      setOpen(false)
    }
  }

  return { open, setOpen, confirmLogout, isLoading }
}

export { useLogout }
