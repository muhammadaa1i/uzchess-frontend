import {
  useGetFavouriteBooksQuery,
  useGetFavouriteCoursesQuery,
} from "@/features/profile/model/profile-favourites-api"
import { useAppSelector } from "@/lib/store/hooks"

// Backs the "Saved items" tab, which per CLAUDE.md's terminology note
// covers both saved courses (GET /courses/favourites) and saved products/
// books (GET /favourites/read) — the View renders these as two sub-sections
// of one tab, not two separate nav items.
function useSavedItems() {
  const isAuthenticated = useAppSelector((state) => !!state.auth.accessToken)

  const books = useGetFavouriteBooksQuery(undefined, { skip: !isAuthenticated })
  const courses = useGetFavouriteCoursesQuery(undefined, { skip: !isAuthenticated })

  return {
    books: books.data ?? [],
    isBooksLoading: books.isLoading && isAuthenticated,
    isBooksError: books.isError,
    courses: courses.data ?? [],
    isCoursesLoading: courses.isLoading && isAuthenticated,
    isCoursesError: courses.isError,
  }
}

export { useSavedItems }
