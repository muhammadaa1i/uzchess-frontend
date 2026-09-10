import { decodeAccessTokenRoles } from "@/features/auth/model/jwt"
import type { RootState } from "@/lib/store/store"

// `_persist` is always present (persistReducer wraps authSlice.reducer
// directly in store.ts) and starts as `{ rehydrated: false }` on both server
// and client — StoreProvider uses `PersistGate loading={null}`, so consumers
// that gate on auth state (e.g. the admin layout) must wait for this to flip
// true before redirecting, or they'll bounce an already-logged-in user during
// the one-tick rehydration window.
function selectAuthRehydrated(state: RootState): boolean {
  return state.auth._persist?.rehydrated ?? false
}

function selectRoles(state: RootState) {
  return decodeAccessTokenRoles(state.auth.accessToken)
}

function selectIsAdmin(state: RootState): boolean {
  const roles = selectRoles(state)
  return roles.includes("admin") || roles.includes("superadmin")
}

function selectIsSuperAdmin(state: RootState): boolean {
  return selectRoles(state).includes("superadmin")
}

export { selectAuthRehydrated, selectRoles, selectIsAdmin, selectIsSuperAdmin }
