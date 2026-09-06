"use client"

import { useTranslations } from "next-intl"

import { TimeControlTag } from "@/components/shared/chess/time-control-tag"
import { ErrorState } from "@/components/shared/error-state"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { LiveGame } from "@/features/live/model/live-schemas"
import { LiveSidebarCourses } from "@/features/live/view/live-sidebar-courses"
import { LiveSidebarPromo } from "@/features/live/view/live-sidebar-promo"
import { LiveVideoPlayerLoader } from "@/features/live/view/live-video-player-loader"
import { useLiveGame } from "@/features/live/viewmodel/use-live-game"

// Single active game (GET /game-of-day/active) — this is the destination of
// Home's "Game of the day" widget play button (../home/view/game-of-day-section.tsx).
// There is no browsable "past games" list on the backend (only
// /active/read/{id} for admin CRUD, no public listing endpoint), so a
// /live/[id] catalog route isn't built — see the backend-gap note in
// ../model/live-schemas.ts for the missing round/viewer-count fields too.
function LiveView() {
  const t = useTranslations("Live")
  const { game, embedUrl, isLoading, isError, refetch } = useLiveGame()

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-2/3 rounded-lg" />
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <ErrorState onRetry={refetch} />
      </div>
    )
  }

  if (!game || !embedUrl) {
    return (
      <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
        <div className="rounded-xl border border-dashed border-border bg-card/50 px-6 py-10 text-center text-sm text-brand-secondary-low">
          {t("empty")}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex max-w-[1376px] flex-col gap-6 px-4 py-8 lg:px-6 lg:py-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="destructive">{t("liveBadge")}</Badge>
            <h1 className="text-2xl font-medium text-brand-white">
              {t("title", { white: game.whitePlayerName, black: game.blackPlayerName })}
            </h1>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-dark-2">
            <LiveVideoPlayerLoader
              embedUrl={embedUrl}
              title={t("title", { white: game.whitePlayerName, black: game.blackPlayerName })}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-[#1A1D1F] px-4 py-3">
            <div className="flex items-center gap-3">
              <PlayerBadge
                name={game.whitePlayerName}
                rating={game.whitePlayerRating}
                avatarUrl={game.whitePlayerAvatarUrl}
              />
              <span className="text-sm text-brand-secondary-low">{t("vs")}</span>
              <PlayerBadge
                name={game.blackPlayerName}
                rating={game.blackPlayerRating}
                avatarUrl={game.blackPlayerAvatarUrl}
              />
            </div>
            <TimeControlTag control={game.gameType} />
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <LiveSidebarCourses />
          <LiveSidebarPromo />
        </aside>
      </div>
    </div>
  )
}

function PlayerBadge({
  name,
  rating,
  avatarUrl,
}: {
  name: string
  rating: number
  avatarUrl?: LiveGame["whitePlayerAvatarUrl"]
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar size="sm">
        <AvatarImage src={avatarUrl ?? undefined} alt={name} />
        <AvatarFallback>{name.charAt(0)}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-brand-white">{name}</span>
      <span className="text-sm text-brand-secondary-low">({rating})</span>
    </div>
  )
}

export { LiveView }
