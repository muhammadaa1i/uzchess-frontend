// Static content for the Contact ("Bog'lanish") page — email, phone, map
// embed. There is no backend endpoint for any of this (checked /swagger/home,
// /swagger/account, /swagger/books, /swagger/courses — nothing resembling a
// "contact info" or "company settings" read model), so it's plain hardcoded
// content rather than a zod schema + API call, same as e.g. the
// SOCIAL_LINKS constant in site-footer.tsx. Placeholder values below
// (phone/email) pending real copy from product/design — the Figma
// "Bog'lanish" frame couldn't be re-verified against the MCP server in this
// pass, see the feature's build report. Address/nearest-metro/working-hours
// are locale-dependent text, not locale-invariant contact data like these —
// they live in Contact.info in the message files instead, so RU/EN visitors
// don't see Uzbek-only copy.
const CONTACT_INFO = {
  email: "info@uzchess.uz",
  phone: "+998 71 200 00 00",
  // Generic Tashkent-centered embed (Google's query-based `/maps?...&output=embed`
  // form needs no API key) — not pinned to the real office address since
  // that wasn't available; swap once product supplies the real location.
  mapEmbedSrc: "https://www.google.com/maps?q=Tashkent,Uzbekistan&output=embed",
} as const

export { CONTACT_INFO }
