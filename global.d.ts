import type messages from "./src/lib/i18n/messages/uz.json"
import type { routing } from "./src/lib/i18n/routing"

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number]
    Messages: typeof messages
  }
}
