import { useGetProfileQuery } from "@/features/profile/model/profile-api"
import { useAppSelector } from "@/lib/store/hooks"

// Core query backing the dashboard header + every edit form's defaults (see
// CLAUDE.md's Profile section). GET /profile is authenticated — skipped
// entirely when signed out, matching useCourseDetail's identical treatment
// of GET /courses/purchased.
function useProfile() {
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)

  const {
    data: profile,
    isLoading,
    isError,
    refetch,
  } = useGetProfileQuery(undefined, { skip: !isAuthenticated })

  return {
    isAuthenticated,
    profile,
    isLoading: isLoading && isAuthenticated,
    isError,
    refetch,
  }
}

export { useProfile }
