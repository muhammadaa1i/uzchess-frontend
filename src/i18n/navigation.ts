import { createNavigation } from "next-intl/navigation"

import { routing } from "@/i18n/routing"

const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)

export { Link, redirect, usePathname, useRouter, getPathname }
