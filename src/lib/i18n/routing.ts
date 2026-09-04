import { defineRouting } from "next-intl/routing"

const routing = defineRouting({
  locales: ["uz", "ru", "en"],
  defaultLocale: "uz",
  localePrefix: "always",
})

export { routing }
