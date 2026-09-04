"use client"

import { useState } from "react"
import { Provider } from "react-redux"
import { persistStore } from "redux-persist"
import { PersistGate } from "redux-persist/integration/react"

import { makeStore } from "@/lib/store/store"

function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store] = useState(makeStore)
  const [persistor] = useState(() => persistStore(store))

  // `persistor.getState().bootstrapped` is false for exactly one tick on
  // the client (rehydrating from localStorage is async) and always false
  // during SSR — `loading={null}` renders children immediately either way
  // rather than blocking on a spinner, since the persisted slice (auth
  // tokens/user) only gates authenticated requests, not the initial paint.
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}

export { StoreProvider }
