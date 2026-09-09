import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { LiveGame } from "@/features/live/model/live-schemas"

interface LivePlayerBadgeProps {
  name: string
  rating: number
  avatarUrl?: LiveGame["whitePlayerAvatarUrl"]
}

function LivePlayerBadge({ name, rating, avatarUrl }: LivePlayerBadgeProps) {
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

export { LivePlayerBadge }
