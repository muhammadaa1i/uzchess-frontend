import type { Metadata } from "next"
import { notFound } from "next/navigation"

// This route renders via the not-found.tsx boundary (HTTP 200 for streamed
// responses in this Next.js version, not a true 404 status), so Next's
// automatic `<meta name="robots" content="noindex">` injection — which only
// fires for real 404 status codes — never kicks in. Metadata exports on
// not-found.tsx itself aren't picked up (verified against the dev server: the
// root layout's metadata wins instead), so it has to live here, on the actual
// matched route segment that throws notFound().
const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
}

// Catch-all for any locale-prefixed path that doesn't match a real route
// (e.g. /uz/some-typo). Without this, an unmatched path never reaches the
// [locale] segment's own not-found.tsx boundary — the framework only renders
// nested not-found.tsx when a matched route explicitly calls notFound(), so
// this route exists purely to trigger that call.
function CatchAll() {
  notFound()
}

export default CatchAll
export { metadata }
