'use client'

import { useGameStore } from '@/lib/game/store'
import type { GameEventType } from '@/lib/game/types'

const EVENT_ICONS: Record<GameEventType, string> = {
  hire: '📋',
  fire: '🚪',
  levelup: '⬆️',
  revenue: '💰',
  expense: '💸',
  task_complete: '✅',
  task_fail: '❌',
  room_unlock: '🔓',
  mood_change: '😊',
  random: '🎲',
}

export function EventNotification() {
  const events = useGameStore((s) => s.events)
  const recentEvents = events.slice(0, 5)

  if (recentEvents.length === 0) return null

  return (
    <div className="pointer-events-none flex flex-col gap-1">
      {recentEvents.map((event, i) => (
        <div
          key={event.id}
          className="pointer-events-auto flex items-center gap-2 rounded border border-white/10 bg-black/60 px-3 py-1.5 text-xs text-white/70 backdrop-blur-sm"
          style={{ opacity: 1 - i * 0.15 }}
        >
          <span>{EVENT_ICONS[event.type]}</span>
          <span>{event.message}</span>
        </div>
      ))}
    </div>
  )
}
