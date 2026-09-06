import { useLocale } from "next-intl"
import { useState } from "react"

import { countryCodesToOptions } from "@/components/shared/country-select"
import {
  useGetRankingFiltersQuery,
  useGetRankingQuery,
} from "@/features/ranking/model/ranking-api"

const PAGE_SIZE = 10

// "All countries" sentinel — the Select primitive doesn't support an empty
// string as a real option value, and `country` being unset on the query
// params means "don't filter" anyway.
const ALL_COUNTRIES = "all"

// Page number and the selected country filter are purely ephemeral,
// view-local UI state (what the currently-open list is showing), not
// app-wide data — so plain `useState` here follows CLAUDE.md's "dropdown
// open/close"-style exception to the Redux Toolkit mandate rather than
// needing a slice.
function useRanking() {
  const locale = useLocale()
  const [page, setPage] = useState(1)
  const [country, setCountry] = useState(ALL_COUNTRIES)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch: refetchRanking,
  } = useGetRankingQuery({
    page,
    size: PAGE_SIZE,
    country: country === ALL_COUNTRIES ? undefined : country,
  })
  const { data: filters, refetch: refetchFilters } = useGetRankingFiltersQuery()

  function handleCountryChange(nextCountry: string) {
    setCountry(nextCountry)
    setPage(1)
  }

  function refetch() {
    refetchRanking()
    refetchFilters()
  }

  return {
    rows: data?.data ?? [],
    isLoading: isLoading || isFetching,
    isError,
    refetch,
    page,
    setPage,
    totalPages: data?.totalPages ?? 0,
    hasNext: data?.hasNext ?? false,
    hasPrevious: data?.hasPrevious ?? false,
    country,
    onCountryChange: handleCountryChange,
    countryOptions: countryCodesToOptions(filters?.countries ?? [], locale),
    allCountriesValue: ALL_COUNTRIES,
  }
}

export { useRanking }
