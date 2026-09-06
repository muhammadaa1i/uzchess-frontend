"use client"

import { useTranslations } from "next-intl"

import { TextField } from "@/components/shared/text-field"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { GlobalSearchResults } from "@/features/search/view/global-search-results"
import { useGlobalSearch } from "@/features/search/viewmodel/use-global-search"

interface GlobalSearchDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// The actual search UI (input + debounced fan-out queries + grouped results)
// — loaded on demand via next/dynamic from global-search-trigger.tsx, only
// while the dialog is open, per CLAUDE.md's code-splitting guidance for
// "modals/dialogs that aren't visible on initial render".
function GlobalSearchDialog({ open, onOpenChange }: GlobalSearchDialogProps) {
  const t = useTranslations("Search")
  const { query, setQuery, isSearchable, isLoading, isError, groups, hasResults } =
    useGlobalSearch()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-4 sm:max-w-md">
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription className="sr-only">{t("title")}</DialogDescription>
        <TextField
          autoFocus
          placeholder={t("placeholder")}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <GlobalSearchResults
            isSearchable={isSearchable}
            isLoading={isLoading}
            isError={isError}
            groups={groups}
            hasResults={hasResults}
            onNavigate={() => onOpenChange(false)}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { GlobalSearchDialog }
