import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number) {
  return `${new Intl.NumberFormat("uz-UZ").format(value)} so'm`
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("uz-UZ", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

const UZ_MONTHS = [
  "Yanvar",
  "Fevral",
  "Mart",
  "Aprel",
  "May",
  "Iyun",
  "Iyul",
  "Avgust",
  "Sentabr",
  "Oktabr",
  "Noyabr",
  "Dekabr",
]

// "12 Dekabr" style day+month string (no year) — Intl's uz-UZ locale renders
// this as "12-dekabr" (hyphenated, lowercase), which doesn't match Figma's
// "12 Dekabr" copy, so this formats it manually instead.
export function formatDayMonth(value: string) {
  const date = new Date(value)
  return `${date.getDate()} ${UZ_MONTHS[date.getMonth()]}`
}
