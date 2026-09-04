import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { AuthUser } from "@/features/auth/model/auth-schemas"

// Which auth overlay (if any) is currently shown over the dimmed home page —
// cross-tree UI state (trigger lives in SiteHeader, display lives in
// AuthModal rendered from SiteShell), so it belongs in Redux rather than
// component-local useState (see CLAUDE.md's Redux mandate).
type AuthModalView = "closed" | "sign-in" | "sign-up" | "verify-email"

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  // Populated by POST /auth/register's response. POST /auth/login only
  // returns a token pair (verified against the live /swagger/account-json
  // spec) — a plain sign-in leaves `user` untouched, see auth-api.ts.
  user: AuthUser | null
  modalView: AuthModalView
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  modalView: "closed",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authModalOpened(state, action: PayloadAction<Exclude<AuthModalView, "closed">>) {
      state.modalView = action.payload
    },
    authModalClosed(state) {
      state.modalView = "closed"
    },
    credentialsSet(
      state,
      action: PayloadAction<{
        accessToken: string
        refreshToken: string
        user?: AuthUser
      }>
    ) {
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      if (action.payload.user) {
        state.user = action.payload.user
      }
    },
    userUpdated(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload
    },
    // Narrower than `userUpdated` — flips the one field the verify-email
    // flow actually changes, without requiring a full AuthUser (which that
    // flow never re-fetches; see auth-api.ts's verifyEmailConfirm).
    emailVerified(state) {
      if (state.user) {
        state.user.isEmailVerified = true
      }
    },
    loggedOut(state) {
      state.accessToken = null
      state.refreshToken = null
      state.user = null
      state.modalView = "closed"
    },
  },
})

const {
  authModalOpened,
  authModalClosed,
  credentialsSet,
  userUpdated,
  emailVerified,
  loggedOut,
} = authSlice.actions

export {
  authSlice,
  authModalOpened,
  authModalClosed,
  credentialsSet,
  userUpdated,
  emailVerified,
  loggedOut,
}
export type { AuthState, AuthModalView }
