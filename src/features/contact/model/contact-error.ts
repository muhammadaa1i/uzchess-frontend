// NestJS's default HTTP exception shape is `{ statusCode, message, error }`,
// where `message` is a string for most errors but a string[] for
// class-validator failures — this normalizes both into one displayable
// string for whatever a `.unwrap()`-ed RTK Query mutation throws (typed
// `unknown` at the catch site). Duplicated from Library's identical helper
// (@/features/library/model/book-error.ts) rather than imported — each
// feature's model layer is self-contained per CLAUDE.md's code-splitting
// mandate.
function getContactErrorMessage(error: unknown, fallback: string): string {
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

export { getContactErrorMessage }
