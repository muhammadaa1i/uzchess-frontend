// This slice's own state shape — the currently-selected filter values the
// desktop sidebar and mobile dialog both read/write. Not backend-validated
// (there's no request body this maps to 1:1; each field feeds a separate
// `GET /books/read` query param via the sibling book-catalog slice's
// viewmodel), so a plain interface rather than a zod schema, per CLAUDE.md's
// Model layer covering "types/... plus the API/data-access layer" generally,
// not only backend-shaped data.
interface CatalogFilterValues {
  categoryId: string
  difficultyId: string
  languageId: string
  minRating: string
}

export type { CatalogFilterValues }
