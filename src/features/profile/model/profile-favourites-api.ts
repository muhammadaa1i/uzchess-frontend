import { z } from "zod"

import {
  profileBookItemSchema,
  profileCourseItemSchema,
} from "@/features/profile/model/profile-schemas"
import { baseApi } from "@/lib/api/base-api"

// "Saved items" endpoints. Per CLAUDE.md's terminology note, Figma's
// "saved books"/"saved products" labels both map to this same
// GET /favourites/read (books) list — not two separate endpoints — while
// "saved courses" is the genuinely distinct GET /courses/favourites.
const profileFavouritesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFavouriteBooks: builder.query<z.infer<typeof profileBookItemSchema>[], void>({
      query: () => ({ url: "/favourites/read" }),
      transformResponse: (response: unknown) => z.array(profileBookItemSchema).parse(response),
    }),
    getFavouriteCourses: builder.query<z.infer<typeof profileCourseItemSchema>[], void>({
      query: () => ({ url: "/courses/favourites" }),
      transformResponse: (response: unknown) => z.array(profileCourseItemSchema).parse(response),
    }),
  }),
})

const { useGetFavouriteBooksQuery, useGetFavouriteCoursesQuery } = profileFavouritesApi

export { profileFavouritesApi, useGetFavouriteBooksQuery, useGetFavouriteCoursesQuery }
