import { useLocale } from "next-intl"
import { useState } from "react"

import { countryCodesToOptions } from "@/components/shared/form/country-select"
import {
  useGetGamesFiltersQuery,
  useGetGamesListQuery,
} from "@/features/ranking/games-list/model/games-list-api"
import type { GameStatus } from "@/features/ranking/games-list/model/games-list-schemas"
import { usePageQueryParam } from "@/lib/hooks/use-page-query-param"

const PAGE_SIZE = 10

// "All countries" sentinel — same convention as use-ranking.ts's
// ALL_COUNTRIES: the Select primitive doesn't support an empty string as a
// real option value, and `country` being unset on the query params means
// "don't filter" anyway.
const ALL_COUNTRIES = "all"

// Page number and the selected country filter are purely ephemeral,
// view-local UI state, not app-wide data — same rationale as
// use-ranking.ts's identical `useState`/`usePageQueryParam` choice over a
// Redux slice. `pageParam` is required (not defaulted to "page") because
// this hook backs two sibling tabs (Completed games / All games) that must
// each keep their own page position in the URL rather than colliding on the
// same query key — and both are distinct from the Ranking table's own
// "page" param on the same route.
function useGamesList(status: GameStatus | undefined, pageParam: string) {
  const locale = useLocale()
  const [page, setPage] = usePageQueryParam(pageParam)
  const [country, setCountry] = useState(ALL_COUNTRIES)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch: refetchGames,
  } = useGetGamesListQuery({
    page,
    size: PAGE_SIZE,
    status,
    country: country === ALL_COUNTRIES ? undefined : country,
  })
  const { data: filters, refetch: refetchFilters } = useGetGamesFiltersQuery()

  function handleCountryChange(nextCountry: string) {
    setCountry(nextCountry)
    setPage(1)
  }

  function refetch() {
    refetchGames()
    refetchFilters()
  }

  return {
    games: data?.data ?? [],
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

export { useGamesList }
