'use client'

import { useGameStore } from '@/lib/game/store'
import { useLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Building2, Lock, Unlock } from 'lucide-react'
import type { Room } from '@/lib/game/types'

function RoomCard({ room, canAfford, onUnlock }: { room: Room; canAfford: boolean; onUnlock: () => void }) {
  return (
    <div
      className={`flex items-center justify-between rounded-md border p-3 ${
        room.unlocked
          ? 'border-emerald-500/20 bg-emerald-500/5'
          : 'border-white/10 bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center gap-3">
        {room.unlocked ? (
          <Unlock className="size-4 text-emerald-400" />
        ) : (
          <Lock className="size-4 text-white/30" />
        )}
        <div>
          <span className="text-sm font-medium text-white/80">{room.name}</span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] text-white/40">
              Capacity: {room.capacity}
            </span>
            {room.unlocked && (
              <Badge variant="outline" className="text-[8px] border-emerald-500/30 text-emerald-400">
                Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      {!room.unlocked && (
        <Button
          variant="ghost"
          size="sm"
          disabled={!canAfford}
          className={`text-xs ${
            canAfford
              ? 'border border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              : 'text-white/20'
          }`}
          onClick={onUnlock}
        >
          ${room.unlockCost.toLocaleString()}
        </Button>
      )}
    </div>
  )
}

export function RoomManager() {
  const { t } = useLocale()
  const rooms = useGameStore((s) => s.rooms)
  const balance = useGameStore((s) => s.economy.balance)
  const unlockRoom = useGameStore((s) => s.unlockRoom)
  const addEvent = useGameStore((s) => s.addEvent)

  const lockedRooms = rooms.filter((r) => !r.unlocked)

  const handleUnlock = (room: Room) => {
    unlockRoom(room.id)
    addEvent({ type: 'room_unlock', message: `${room.name} has been unlocked!` })
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 hover:text-amber-300"
        >
          <Building2 className="size-3.5" />
          Rooms
          {lockedRooms.length > 0 && (
            <Badge variant="outline" className="ml-1 text-[9px] border-white/10 text-white/40">
              {lockedRooms.length} locked
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-gray-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">Office Rooms</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              canAfford={balance >= room.unlockCost}
              onUnlock={() => handleUnlock(room)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
