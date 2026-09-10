import {
  selectAuthRehydrated,
  selectIsAdmin,
  selectIsSuperAdmin,
} from "@/features/auth/model/auth-selectors"
import { useAppSelector } from "@/lib/store/hooks"

// Used by the /admin layout guard and by any page that needs a stricter gate
// (e.g. role-management is superadmin-only even though it lives under the
// admin-only shell) — see auth-selectors.ts for why `isRehydrated` matters.
function useAdminAccess() {
  const isRehydrated = useAppSelector(selectAuthRehydrated)
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)
  const isAdmin = useAppSelector(selectIsAdmin)
  const isSuperAdmin = useAppSelector(selectIsSuperAdmin)

  return { isRehydrated, isAuthenticated, isAdmin, isSuperAdmin }
}

export { useAdminAccess }
