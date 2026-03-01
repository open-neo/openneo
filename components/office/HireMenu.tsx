'use client'

import { useState } from 'react'
import { useGameStore } from '@/lib/game/store'
import { useLocale } from '@/lib/i18n'
import { createOfficeAgent } from '@/lib/game/adapter'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AGENT_ROLES, type AgentRole } from '@/lib/game/types'
import { ROLE_COLORS, ROLE_LABELS } from '@/lib/game/sprites'
import { UserPlus } from 'lucide-react'

const ROLE_DESCRIPTIONS: Record<AgentRole, string> = {
  developer: 'Writes code, fixes bugs, reviews PRs',
  sales: 'Outreach, demos, closing deals',
  marketer: 'Content, campaigns, analytics',
  finance: 'Bookkeeping, forecasts, reports',
  hr: 'Recruiting, onboarding, culture',
  support: 'Tickets, docs, troubleshooting',
  researcher: 'Data analysis, market research',
}

const ROLE_SALARIES: Record<AgentRole, number> = {
  developer: 8000,
  sales: 6000,
  marketer: 5500,
  finance: 7000,
  hr: 5000,
  support: 4500,
  researcher: 7500,
}

export function HireMenu() {
  const { t } = useLocale()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedRole, setSelectedRole] = useState<AgentRole>('developer')
  const hireAgent = useGameStore((s) => s.hireAgent)
  const addEvent = useGameStore((s) => s.addEvent)
  const rooms = useGameStore((s) => s.rooms)
  const agents = useGameStore((s) => s.agents)

  const handleHire = () => {
    if (!name.trim()) return

    // Find a position in the matching room
    const room = rooms.find((r) => {
      if (selectedRole === 'developer') return r.id === 'dev'
      if (selectedRole === 'sales' || selectedRole === 'marketer') return r.id === 'sales'
      if (selectedRole === 'finance') return r.id === 'finance'
      if (selectedRole === 'hr') return r.id === 'hr'
      if (selectedRole === 'support') return r.id === 'support'
      if (selectedRole === 'researcher') return r.id === 'research'
      return r.id === 'lobby'
    })

    // Calculate grid position (offset within room)
    const roomAgents = agents.filter((a) => a.roomId === room?.id).length
    const gridX = (room?.gridBounds.x ?? 0) + 2 + (roomAgents % 3) * 3
    const gridY = (room?.gridBounds.y ?? 0) + 2 + Math.floor(roomAgents / 3) * 2

    const agent = createOfficeAgent(name.trim(), selectedRole, { x: gridX, y: gridY })
    hireAgent(agent)
    addEvent({ type: 'hire', message: `${name.trim()} was hired as ${selectedRole}`, agentId: agent.id })

    setName('')
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-1.5 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
        >
          <UserPlus className="size-3.5" />
          {t('office.hire')}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-gray-900 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-mono">{t('office.hireTitle')}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Name input */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/60">{t('office.agentName')}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alice"
              className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
              onKeyDown={(e) => e.key === 'Enter' && handleHire()}
            />
          </div>

          {/* Role selector */}
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs text-white/60">{t('office.selectRole')}</Label>
            <div className="grid grid-cols-2 gap-2">
              {AGENT_ROLES.map((role) => {
                const color = ROLE_COLORS[role]
                const hexColor = `#${color.toString(16).padStart(6, '0')}`
                return (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`flex flex-col gap-0.5 rounded-md border p-2 text-left transition-colors ${
                      selectedRole === role
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/5 bg-white/[0.02] hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full" style={{ backgroundColor: hexColor }} />
                      <span className="text-xs font-semibold text-white/80">{ROLE_LABELS[role]}</span>
                    </div>
                    <span className="text-[10px] text-white/40">{ROLE_DESCRIPTIONS[role]}</span>
                    <span className="font-mono text-[10px] text-emerald-400">
                      ${ROLE_SALARIES[role].toLocaleString()}/mo
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            onClick={handleHire}
            disabled={!name.trim()}
            className="bg-emerald-600 text-white hover:bg-emerald-500"
          >
            {t('office.hireConfirm')} — ${ROLE_SALARIES[selectedRole].toLocaleString()}/mo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
