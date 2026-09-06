// Static content for the Contact ("Bog'lanish") page — map, working hours,
// email, phone, nearest metro station. There is no backend endpoint for any
// of this (checked /swagger/home, /swagger/account, /swagger/books,
// /swagger/courses — nothing resembling a "contact info" or "company
// settings" read model), so it's plain hardcoded content rather than a zod
// schema + API call, same as e.g. the SOCIAL_LINKS constant in
// site-footer.tsx. Placeholder values below (address/phone/email/hours)
// pending real copy from product/design — the Figma "Bog'lanish" frame
// couldn't be re-verified against the MCP server in this pass, see the
// feature's build report.
const CONTACT_INFO = {
  address: "Toshkent sh., Yunusobod tumani, Amir Temur shoh ko'chasi 1",
  nearestMetro: "Amir Temur xiyoboni",
  email: "info@uzchess.uz",
  phone: "+998 71 200 00 00",
  workingHours: {
    weekdays: "Dushanba – Juma: 09:00 – 18:00",
    weekend: "Shanba – Yakshanba: dam olish kuni",
  },
  // Generic Tashkent-centered embed (Google's query-based `/maps?...&output=embed`
  // form needs no API key) — not pinned to the real office address since
  // that wasn't available; swap once product supplies the real location.
  mapEmbedSrc: "https://www.google.com/maps?q=Tashkent,Uzbekistan&output=embed",
} as const

export { CONTACT_INFO }
