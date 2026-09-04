import { combineReducers, configureStore } from "@reduxjs/toolkit"
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist"

import { authSlice } from "@/features/auth/model/auth-slice"
import { baseApi } from "@/lib/api/base-api"
import { persistStorage } from "@/lib/store/storage"

// Only the auth slice is persisted, and only its tokens/user — the modal
// UI-state field (`modalView`) is deliberately left out so a reload never
// reopens a stale modal (see CLAUDE.md's Auth section: "persist only the
// auth slice's tokens/user, not the whole store").
const persistedAuthReducer = persistReducer(
  {
    key: "auth",
    storage: persistStorage,
    whitelist: ["accessToken", "refreshToken", "user"],
  },
  authSlice.reducer
)

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: persistedAuthReducer,
})

function makeStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // redux-persist dispatches non-serializable actions internally —
        // ignoring them is the documented redux-persist + RTK setup.
        serializableCheck: {
          ignoredActions: [FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE],
        },
      }).concat(baseApi.middleware),
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]

export { makeStore }
