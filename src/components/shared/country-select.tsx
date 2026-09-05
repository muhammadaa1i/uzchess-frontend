"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Country {
  code: string
  name: string
  flag: string
}

interface CountrySelectProps {
  countries: Country[]
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
}

// Converts a 2-letter ISO country code into a flag emoji via the Unicode
// "regional indicator symbol" trick (each letter A-Z maps to U+1F1E6-U+1F1FF)
// — no flag-image asset list needed for arbitrary country codes.
function countryCodeToFlagEmoji(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

// Backend filter endpoints (e.g. GET /players/ranking/filters) only return
// raw ISO country codes, not display names — `Intl.DisplayNames` renders a
// locale-aware name (matching the site's uz/ru/en locales) without needing
// a bundled country-name dataset.
function countryCodesToOptions(codes: string[], locale: string): Country[] {
  const displayNames = new Intl.DisplayNames([locale], { type: "region" })
  return codes
    .map((code) => ({
      code,
      name: displayNames.of(code) ?? code,
      flag: countryCodeToFlagEmoji(code),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}

function CountrySelect({
  countries,
  value,
  onValueChange,
  placeholder = "Mamlakatni tanlang",
  className,
}: CountrySelectProps) {
  return (
    <Select
      value={value}
      onValueChange={(nextValue) => {
        if (nextValue !== null) onValueChange?.(nextValue)
      }}
    >
      <SelectTrigger className={className}>
        {/* base-ui's SelectValue only renders the raw value unless given a
         * render function — it doesn't look up the matching SelectItem's
         * children automatically (see @base-ui/react/select's SelectValue
         * type: "children?: ReactNode | ((value) => ReactNode)"). */}
        <SelectValue placeholder={placeholder}>
          {(selected: string | null) => {
            const selectedCountry = countries.find((country) => country.code === selected)
            return selectedCountry ? (
              <>
                <span aria-hidden>{selectedCountry.flag}</span>
                {selectedCountry.name}
              </>
            ) : (
              placeholder
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.code}>
            <span aria-hidden>{country.flag}</span>
            {country.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { CountrySelect, countryCodesToOptions }
export type { Country, CountrySelectProps }
