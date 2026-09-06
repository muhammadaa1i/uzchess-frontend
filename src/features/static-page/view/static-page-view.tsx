"use client"

import { useTranslations } from "next-intl"

interface StaticPageSection {
  heading: string
  body: string
}

interface StaticPageViewProps {
  /** Translation key under the "StaticPage" namespace, e.g. "about". */
  page: "about" | "terms" | "cookiePolicy"
}

// Reusable template for genuinely static/CMS-style content pages (Terms,
// About, Cookie policy, ...). There's no CMS-content endpoint in any
// /swagger/* group, so this content is translated static copy (uz/ru/en via
// next-intl) rather than backend-driven — no model/viewmodel layer needed.
function StaticPageView({ page }: StaticPageViewProps) {
  const t = useTranslations(`StaticPage.${page}`)
  const sections = t.raw("sections") as StaticPageSection[]

  return (
    <div className="mx-auto flex max-w-[860px] flex-col gap-8 px-4 py-12 lg:px-6 lg:py-16">
      <h1 className="text-2xl font-medium text-brand-white lg:text-3xl">{t("title")}</h1>
      <div className="flex flex-col gap-8">
        {sections.map((section) => (
          <section key={section.heading} className="flex flex-col gap-2">
            <h2 className="text-lg font-medium text-brand-white">{section.heading}</h2>
            <p className="whitespace-pre-line text-base text-brand-secondary-low">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </div>
  )
}

export { StaticPageView }
