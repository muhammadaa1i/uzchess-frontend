import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

import type { AuthUser } from "@/features/auth/session/model/auth-schemas"

// Which auth overlay (if any) is currently shown over the dimmed home page —
// cross-tree UI state (trigger lives in SiteHeader, display lives in
// AuthModal rendered from SiteShell), so it belongs in Redux rather than
// component-local useState (see CLAUDE.md's Redux mandate).
// `forgot-password`/`reset-password` are the two "forgot password" flow
// steps (see features/auth/forgot-password) — a public, email+code flow,
// not the Figma phone-based one (see CLAUDE.md's Auth section).
type AuthModalView =
  | "closed"
  | "sign-in"
  | "sign-up"
  | "verify-email"
  | "forgot-password"
  | "reset-password"

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  // Populated by both POST /auth/register's and POST /auth/login's
  // responses — both return the user plus a token pair, see
  // register/model/register-api.ts, login/model/login-api.ts.
  user: AuthUser | null
  modalView: AuthModalView
  // The email the user entered on the `forgot-password` step, carried over
  // to `reset-password` (a public, unauthenticated endpoint that needs the
  // email as an explicit field — see forgot-password/viewmodel's
  // use-reset-password.ts). Deliberately left out of store.ts's persist
  // whitelist, same as `modalView`.
  forgotPasswordEmail: string | null
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  modalView: "closed",
  forgotPasswordEmail: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authModalOpened(state, action: PayloadAction<Exclude<AuthModalView, "closed">>) {
      state.modalView = action.payload
      // Opening any view other than `reset-password` directly (e.g. the
      // header's "Kirish", or a fresh "Forgot password?" click) means we're
      // not continuing a still-in-progress reset — drop any stale email so
      // it never leaks into a later attempt.
      if (action.payload !== "reset-password") {
        state.forgotPasswordEmail = null
      }
    },
    authModalClosed(state) {
      state.modalView = "closed"
      state.forgotPasswordEmail = null
    },
    // Dispatched once POST /auth/forgot-password succeeds — advances the
    // modal to the code + new-password step and carries the email forward
    // (see forgot-password/viewmodel/use-forgot-password.ts).
    passwordResetCodeSent(state, action: PayloadAction<string>) {
      state.modalView = "reset-password"
      state.forgotPasswordEmail = action.payload
    },
    // Dispatched once POST /auth/reset-password succeeds — the reset
    // revokes all of the user's existing sessions server-side, so this
    // always routes to sign-in rather than trying to keep them signed in
    // (see forgot-password/viewmodel/use-reset-password.ts).
    passwordResetCompleted(state) {
      state.modalView = "sign-in"
      state.forgotPasswordEmail = null
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
    // flow never re-fetches; see verify-email/viewmodel/use-verify-email.ts).
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
      state.forgotPasswordEmail = null
    },
  },
})

const {
  authModalOpened,
  authModalClosed,
  credentialsSet,
  userUpdated,
  emailVerified,
  passwordResetCodeSent,
  passwordResetCompleted,
  loggedOut,
} = authSlice.actions

export {
  authSlice,
  authModalOpened,
  authModalClosed,
  credentialsSet,
  userUpdated,
  emailVerified,
  passwordResetCodeSent,
  passwordResetCompleted,
  loggedOut,
}
export type { AuthState, AuthModalView }
