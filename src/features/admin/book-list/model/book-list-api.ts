import type { z } from "zod"

import {
  deleteBookResponseSchema,
  paginatedBooksAdminSchema,
} from "@/features/admin/book-list/model/book-list-schemas"
import { baseApi } from "@/lib/api/base-api"

interface GetAdminBooksParams {
  page?: number
  size?: number
}

// Book list's own RTK Query endpoints, injected into the shared endpoint-less
// `baseApi` (see CLAUDE.md's code-splitting mandate) — kept separate from the
// public book-catalog feature's identically-shaped `getBooks` endpoint
// (src/features/library/book-catalog/model/book-catalog-api.ts) and from the
// sibling book-editor slice's `createBook`/`updateBook`/reference-list
// endpoints, since endpoints for one feature/slice must not live in another
// slice's model file even against the same backend route. `deleteBook` lives
// here (not book-editor) since delete is triggered from a list row, not the
// create/edit form. Mutations are admin-only per CLAUDE.md's admin-panel note
// (backend-enforced via `@Roles(Role.Admin)` on BookController — only the GET
// routes are `@Public()`). No RTK Query tag invalidation is used anywhere in
// this codebase yet — list refreshes are done via an explicit `refetch()`
// call after a mutation succeeds, same pattern as news-management-api.ts.
const bookListApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBooks: builder.query<
      z.infer<typeof paginatedBooksAdminSchema>,
      GetAdminBooksParams | void
    >({
      query: (params) => ({ url: "/books/read", params: params ?? undefined }),
      transformResponse: (response: unknown) => paginatedBooksAdminSchema.parse(response),
    }),
    deleteBook: builder.mutation<z.infer<typeof deleteBookResponseSchema>, number>({
      query: (id) => ({ url: `/books/delete/${id}`, method: "DELETE" }),
      transformResponse: (response: unknown) => deleteBookResponseSchema.parse(response),
    }),
  }),
})

const { useGetAdminBooksQuery, useDeleteBookMutation } = bookListApi

export { bookListApi, useDeleteBookMutation, useGetAdminBooksQuery }
