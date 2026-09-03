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
        <SelectValue placeholder={placeholder} />
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

export { CountrySelect }
export type { Country, CountrySelectProps }
