import { getTranslations } from "next-intl/server"

import { SimpleBoard } from "@/components/shared/chess/simple-board"
import { Button } from "@/components/ui/button"
import { Link } from "@/lib/i18n/navigation"

// Next.js special file: rendered whenever a route inside the [locale]
// segment doesn't resolve (see the "not-found" entry in eslint.config.mjs's
// default-export allow-list). Purely decorative/static — no data fetching,
// no viewmodel needed. Server Component (not-found files run outside client
// boundaries), so this reads translations via next-intl/server rather than
// the useTranslations client hook the rest of the views use.
async function NotFound() {
  const t = await getTranslations("NotFound")

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col items-center gap-8 px-4 py-16 text-center lg:px-6 lg:py-24">
      <SimpleBoard
        size={240}
        className="opacity-80"
        pieces={[
          { row: 0, col: 1, piece: "king", side: "black" },
          { row: 1, col: 6, piece: "queen", side: "white" },
          { row: 3, col: 3, piece: "knight", side: "black" },
          { row: 5, col: 5, piece: "bishop", side: "white" },
          { row: 6, col: 1, piece: "pawn", side: "black" },
          { row: 7, col: 4, piece: "king", side: "white" },
        ]}
      />
      <div className="flex flex-col gap-3">
        <span className="text-6xl font-bold text-brand-white">404</span>
        <h1 className="text-2xl font-medium text-brand-white">{t("title")}</h1>
        <p className="max-w-md text-base text-brand-secondary-low">{t("description")}</p>
      </div>
      <Button size="lg" nativeButton={false} render={<Link href="/" />}>
        {t("cta")}
      </Button>
    </div>
  )
}

export default NotFound
