import { useEffect, useState } from "react"

// How long the sign-in/sign-up submit button stays disabled after the
// backend's ThrottlerException (429) — the response body doesn't carry a
// Retry-After value we can read reliably, so this is a fixed fallback
// rather than an exact echo of the backend's actual throttle window.
const THROTTLE_COOLDOWN_SECONDS = 30

// Shared by useSignIn/useSignUp (same feature, so sharing here doesn't
// violate CLAUDE.md's cross-feature duplication mandate) — ticks a
// countdown down to 0 once started, same pattern as useVerifyEmail's
// resend cooldown.
function useThrottleCooldown() {
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => setCooldown((value) => value - 1), 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  return [cooldown, setCooldown] as const
}

export { THROTTLE_COOLDOWN_SECONDS, useThrottleCooldown }
