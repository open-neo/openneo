'use client'

import { OfficeCanvas } from './OfficeCanvas'
import { GameHUD } from './GameHUD'
import { AgentPanel } from './AgentPanel'
import { HireMenu } from './HireMenu'
import { RoomManager } from './RoomManager'
import { EventNotification } from './EventNotification'
import { ModeToggle } from '@/components/mode-toggle'
import { useGameTick } from '@/hooks/use-game-tick'
import { useStoreSync } from '@/lib/game/sync'

export function OfficeView() {
  useGameTick()
  useStoreSync()

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Canvas layer (full background) */}
      <div className="absolute inset-0">
        <OfficeCanvas />
      </div>

      {/* React overlay layer — pointer-events-none so clicks pass through to canvas */}
      <div className="pointer-events-none relative z-10 flex h-full flex-col">
        {/* Top bar: HUD */}
        <div className="flex items-start justify-center px-4">
          <GameHUD />
        </div>

        {/* Middle: agent panel (left) + events (right) */}
        <div className="flex flex-1 items-start justify-between p-4">
          <AgentPanel />
          <EventNotification />
        </div>

        {/* Bottom bar: actions */}
        <div className="pointer-events-auto flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-2">
            <HireMenu />
            <RoomManager />
          </div>
          <ModeToggle />
        </div>
      </div>
    </div>
  )
}
