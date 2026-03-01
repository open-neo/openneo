'use client'

import { useGameStore } from '@/lib/game/store'
import { useLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pause, Play, FastForward, Users, DollarSign, Calendar } from 'lucide-react'

export function GameHUD() {
  const { t } = useLocale()
  const economy = useGameStore((s) => s.economy)
  const agents = useGameStore((s) => s.agents)
  const gameDay = useGameStore((s) => s.gameDay)
  const isPaused = useGameStore((s) => s.isPaused)
  const timeScale = useGameStore((s) => s.timeScale)
  const mode = useGameStore((s) => s.mode)
  const togglePause = useGameStore((s) => s.togglePause)
  const setTimeScale = useGameStore((s) => s.setTimeScale)

  return (
    <div className="pointer-events-auto flex items-center gap-3 rounded-b-lg border border-t-0 border-white/10 bg-black/70 px-4 py-2 backdrop-blur-sm">
      {/* Balance */}
      <div className="flex items-center gap-1.5">
        <DollarSign className="size-3.5 text-emerald-400" />
        <span className="font-mono text-sm font-bold text-emerald-400">
          {economy.balance.toLocaleString()}
        </span>
      </div>

      <div className="h-4 w-px bg-white/20" />

      {/* Revenue / Cost */}
      <div className="flex items-center gap-2 text-xs text-white/60">
        <span className="text-emerald-300">+{economy.monthlyRevenue.toLocaleString()}</span>
        <span className="text-red-300">-{economy.monthlyCost.toLocaleString()}</span>
      </div>

      <div className="h-4 w-px bg-white/20" />

      {/* Agents */}
      <div className="flex items-center gap-1.5">
        <Users className="size-3.5 text-blue-400" />
        <span className="font-mono text-sm text-white/80">{agents.length}</span>
      </div>

      <div className="h-4 w-px bg-white/20" />

      {/* Day */}
      <div className="flex items-center gap-1.5">
        <Calendar className="size-3.5 text-amber-400" />
        <span className="font-mono text-sm text-white/80">
          {t('office.day')} {gameDay}
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Mode badge */}
      <Badge
        variant="outline"
        className={mode === 'real'
          ? 'border-red-400/50 bg-red-500/20 text-red-300 text-[10px]'
          : 'border-blue-400/50 bg-blue-500/20 text-blue-300 text-[10px]'
        }
      >
        {mode === 'real' ? t('office.realMode') : t('office.simMode')}
      </Badge>

      <div className="h-4 w-px bg-white/20" />

      {/* Time controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className="size-7 p-0 text-white/70 hover:text-white hover:bg-white/10"
          onClick={togglePause}
        >
          {isPaused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
        </Button>
        {([1, 2, 4] as const).map((speed) => (
          <Button
            key={speed}
            variant="ghost"
            size="sm"
            className={`h-7 px-1.5 text-xs ${
              timeScale === speed
                ? 'bg-white/20 text-white'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setTimeScale(speed)}
          >
            {speed === 1 ? '1x' : speed === 2 ? '2x' : '4x'}
          </Button>
        ))}
      </div>
    </div>
  )
}
