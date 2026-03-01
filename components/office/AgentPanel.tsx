'use client'

import { useGameStore } from '@/lib/game/store'
import { useLocale } from '@/lib/i18n'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { X, TrendingUp, Brain, Zap, Heart, Star } from 'lucide-react'
import type { OfficeAgent } from '@/lib/game/types'
import { ROLE_LABELS } from '@/lib/game/sprites'

function StatBar({ label, value, max, icon }: { label: string; value: number; max: number; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="w-20 text-xs text-white/60">{label}</span>
      <Progress value={(value / max) * 100} className="h-1.5 flex-1 bg-white/10" />
      <span className="w-8 text-right font-mono text-xs text-white/80">{value}</span>
    </div>
  )
}

const MOOD_COLORS: Record<string, string> = {
  excellent: 'border-emerald-400 bg-emerald-500/20 text-emerald-300',
  good: 'border-blue-400 bg-blue-500/20 text-blue-300',
  neutral: 'border-gray-400 bg-gray-500/20 text-gray-300',
  stressed: 'border-amber-400 bg-amber-500/20 text-amber-300',
  critical: 'border-red-400 bg-red-500/20 text-red-300',
}

export function AgentPanel() {
  const { t } = useLocale()
  const selectedAgentId = useGameStore((s) => s.selectedAgentId)
  const agents = useGameStore((s) => s.agents)
  const selectAgent = useGameStore((s) => s.selectAgent)
  const fireAgent = useGameStore((s) => s.fireAgent)
  const addEvent = useGameStore((s) => s.addEvent)

  const agent = agents.find((a) => a.id === selectedAgentId)
  if (!agent) return null

  const handleFire = () => {
    fireAgent(agent.id)
    addEvent({ type: 'fire', message: `${agent.name} was fired`, agentId: agent.id })
  }

  return (
    <div className="pointer-events-auto flex w-80 flex-col gap-3 rounded-lg border border-white/10 bg-black/80 p-4 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-mono text-sm font-bold text-white">{agent.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-[10px] border-white/20 text-white/60">
              {ROLE_LABELS[agent.role]}
            </Badge>
            <Badge variant="outline" className={`text-[10px] ${MOOD_COLORS[agent.mood]}`}>
              {t(`office.mood.${agent.mood}`)}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="size-6 p-0 text-white/40 hover:text-white hover:bg-white/10"
          onClick={() => selectAgent(null)}
        >
          <X className="size-3.5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
          {t('office.stats')}
        </span>
        <StatBar label={t('office.stat.performance')} value={agent.stats.performance} max={100} icon={<TrendingUp className="size-3 text-emerald-400" />} />
        <StatBar label={t('office.stat.reliability')} value={agent.stats.reliability} max={100} icon={<Heart className="size-3 text-red-400" />} />
        <StatBar label={t('office.stat.creativity')} value={agent.stats.creativity} max={100} icon={<Brain className="size-3 text-purple-400" />} />
      </div>

      {/* Level & XP */}
      <div className="flex items-center gap-2">
        <Star className="size-3.5 text-amber-400" />
        <span className="text-xs text-white/60">{t('office.level')} {agent.stats.level}</span>
        <Progress value={(agent.stats.experience % 100)} className="h-1 flex-1 bg-white/10" />
        <span className="font-mono text-[10px] text-white/40">{agent.stats.experience} XP</span>
      </div>

      {/* Financials */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
          {t('office.financials')}
        </span>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <span className="text-white/50">{t('office.salary')}</span>
          <span className="text-right font-mono text-white/80">${agent.financials.salary.toLocaleString()}/mo</span>
          <span className="text-white/50">{t('office.revenue')}</span>
          <span className="text-right font-mono text-emerald-300">${agent.financials.revenueGenerated.toLocaleString()}</span>
          <span className="text-white/50">{t('office.roi')}</span>
          <span className={`text-right font-mono ${agent.financials.roi >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
            {agent.financials.roi >= 0 ? '+' : ''}{agent.financials.roi.toFixed(0)}%
          </span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
          {t('office.skills')}
        </span>
        <div className="flex flex-wrap gap-1">
          {agent.skills.map((skill) => (
            <Badge key={skill} variant="outline" className="text-[10px] border-white/10 text-white/50">
              {skill}
            </Badge>
          ))}
        </div>
      </div>

      {/* Tasks completed */}
      <div className="flex items-center gap-2 text-xs">
        <Zap className="size-3 text-amber-400" />
        <span className="text-white/50">{t('office.tasksCompleted')}</span>
        <span className="font-mono text-white/80">{agent.stats.tasksCompleted}</span>
      </div>

      {/* Fire button */}
      <Button
        variant="ghost"
        size="sm"
        className="mt-1 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300"
        onClick={handleFire}
      >
        {t('office.fireAgent')}
      </Button>
    </div>
  )
}
