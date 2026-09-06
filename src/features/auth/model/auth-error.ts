// NestJS's default HTTP exception shape is `{ statusCode, message, error }`,
// where `message` is a string for most errors but a string[] for
// class-validator failures — this normalizes both into one displayable
// string for whatever a `.unwrap()`-ed RTK Query mutation throws (typed
// `unknown` at the catch site).
function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (typeof error !== "object" || error === null) return fallback

  if ("data" in error) {
    const data = (error as { data?: unknown }).data
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as { message: unknown }).message
      if (typeof message === "string") return message
      if (Array.isArray(message) && typeof message[0] === "string") return message[0]
    }
  }

  if ("message" in error && typeof (error as { message: unknown }).message === "string") {
    return (error as { message: string }).message
  }

  return fallback
}

// Backend rate-limits auth endpoints (NestJS `ThrottlerException`, HTTP 429)
// — callers use this to switch to a disabled-button + countdown state
// instead of showing the raw exception text and letting the user hammer
// the button, which only extends the throttle window.
function isThrottled(error: unknown): boolean {
  if (typeof error !== "object" || error === null) return false
  return (error as { status?: unknown }).status === 429
}

export { getAuthErrorMessage, isThrottled }
