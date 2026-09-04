import createWebStorage from "redux-persist/lib/storage/createWebStorage"

// redux-persist's default `localStorage` engine touches `window` at import
// time, which doesn't exist during Next.js's server render — using it
// directly here would throw during SSR and/or cause a hydration mismatch.
// This falls back to a no-op storage engine on the server and only reaches
// for real `localStorage` in the browser (the standard SSR-safe pattern for
// redux-persist + Next.js App Router).
function createNoopStorage() {
  return {
    getItem() {
      return Promise.resolve(null)
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value)
    },
    removeItem() {
      return Promise.resolve()
    },
  }
}

const persistStorage =
  typeof window !== "undefined" ? createWebStorage("local") : createNoopStorage()

export { persistStorage }
