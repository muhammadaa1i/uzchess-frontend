"use client"

import { PlayIcon } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { useState } from "react"

import { TimeControlTag } from "@/components/shared/chess/time-control-tag"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { resolveGameOfDayThumbnail, toYoutubeEmbedUrl } from "@/features/home/model/home-schemas"
import { GameOfDayPlayerLoader } from "@/features/home/view/game-of-day-player-loader"
import { SectionHeading } from "@/features/home/view/section-heading"
import { useGameOfDay } from "@/features/home/viewmodel/use-game-of-day"
import { cn } from "@/lib/utils"

// The header's "Смотреть/Ko'rish" link still goes to the single-game Live
// page (src/app/[locale]/live) — same GET /game-of-day/active resource,
// refetched independently there per the Live feature's own code-splitting
// boundary (see src/features/live/model/live-api.ts). The thumbnail itself
// now plays the game's real video inline: clicking it swaps the poster
// image for a YouTube iframe embed (view-local `isPlaying` state — purely
// ephemeral UI state, not a candidate for Redux) instead of only linking
// away to /live.
function GameOfDaySection() {
  const t = useTranslations("Home.gameOfDay")
  const { gameOfDay, isLoading, isError } = useGameOfDay()
  const [isPlaying, setIsPlaying] = useState(false)

  if (isLoading) {
    return (
      <section className="flex flex-col gap-4">
        <SectionHeading title={t("title")} />
        <Skeleton className="h-[309px] w-full rounded-lg" />
      </section>
    )
  }

  // No active game of the day (or the endpoint errored, e.g. the known 401
  // on /game-of-day/active) — hide the section, it's a spotlight widget
  // rather than core content.
  if (isError || !gameOfDay) return null

  return (
    <section className="flex flex-col overflow-hidden rounded-lg bg-[#272B30]">
      <SectionHeading
        title={t("title")}
        actionLabel={t("watch")}
        actionIcon
        href="/live"
        actionClassName="text-brand-secondary-low"
        className="h-[58px] px-4"
      />
      <div className="relative aspect-[326/183] w-full">
        {isPlaying ? (
          <GameOfDayPlayerLoader
            embedUrl={toYoutubeEmbedUrl(gameOfDay.videoUrl)}
            title={t("watchAria")}
          />
        ) : (
          <>
            <Image
              src={resolveGameOfDayThumbnail(gameOfDay.thumbnailUrl, gameOfDay.videoUrl)}
              alt=""
              fill
              sizes="(min-width: 1024px) 326px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <Button
              size="icon-lg"
              onClick={() => setIsPlaying(true)}
              aria-label={t("watchAria")}
              className="absolute inset-0 m-auto size-14 rounded-full"
            >
              <PlayIcon className="fill-current" />
            </Button>
            <div className="absolute inset-x-0 bottom-0 flex h-11 items-center justify-end gap-3 border-t border-white/20 bg-dark/40 px-3 backdrop-blur-sm">
              <TimeControlTag control={gameOfDay.gameType} />
            </div>
          </>
        )}
      </div>
      <div className="flex h-[68px] items-center justify-between gap-4 bg-dark px-4">
        <PlayerChip name={gameOfDay.whitePlayerName} colorClassName="bg-brand-green" />
        <PlayerChip name={gameOfDay.blackPlayerName} colorClassName="bg-brand-red/10" />
      </div>
    </section>
  )
}

function PlayerChip({
  name,
  colorClassName,
}: {
  name: string
  colorClassName: string
}) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className={cn("size-2 shrink-0 rounded-sm", colorClassName)} />
      <span className="truncate text-sm font-medium text-brand-white">{name}</span>
    </div>
  )
}

export { GameOfDaySection }
