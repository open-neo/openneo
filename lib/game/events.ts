import type { OfficeAgent, GameEvent, GameState } from './types'

type EventTemplate = Omit<GameEvent, 'id' | 'timestamp'>

// ─── Random event pool ───

const RANDOM_EVENTS: ((agent: OfficeAgent) => EventTemplate | null)[] = [
  (a) => a.stats.level >= 3
    ? { type: 'random', message: `${a.name} discovered a productivity shortcut`, agentId: a.id }
    : null,
  (a) => a.mood === 'excellent'
    ? { type: 'random', message: `${a.name} is on a creative streak!`, agentId: a.id }
    : null,
  (a) => a.mood === 'stressed'
    ? { type: 'random', message: `${a.name} needs a coffee break`, agentId: a.id }
    : null,
  (a) => a.role === 'sales' && Math.random() < 0.3
    ? { type: 'revenue', message: `${a.name} closed a new deal!`, agentId: a.id }
    : null,
  (a) => a.role === 'developer' && Math.random() < 0.2
    ? { type: 'task_complete', message: `${a.name} shipped a feature`, agentId: a.id }
    : null,
  (a) => a.role === 'marketer' && Math.random() < 0.25
    ? { type: 'random', message: `${a.name}'s campaign is gaining traction`, agentId: a.id }
    : null,
  (a) => a.role === 'support' && Math.random() < 0.3
    ? { type: 'task_complete', message: `${a.name} resolved a support ticket`, agentId: a.id }
    : null,
  (a) => a.role === 'researcher' && Math.random() < 0.2
    ? { type: 'random', message: `${a.name} found an interesting insight`, agentId: a.id }
    : null,
]

// ─── Generate random events for a tick ───

export function generateTickEvents(state: GameState): EventTemplate[] {
  const events: EventTemplate[] = []

  // Low probability per tick — roughly 1 event per 10-20 ticks
  if (Math.random() > 0.15) return events

  for (const agent of state.agents) {
    for (const generator of RANDOM_EVENTS) {
      const event = generator(agent)
      if (event) {
        events.push(event)
        return events // max 1 event per tick
      }
    }
  }

  return events
}

// ─── Milestone events ───

export function checkMilestones(state: GameState): EventTemplate[] {
  const events: EventTemplate[] = []

  // Customer milestones
  const milestones = [10, 50, 100, 500, 1000]
  for (const m of milestones) {
    if (state.economy.customers === m) {
      events.push({
        type: 'revenue',
        message: `Reached ${m} customers!`,
      })
    }
  }

  // Balance milestones
  const balanceMilestones = [200000, 500000, 1000000]
  for (const m of balanceMilestones) {
    if (state.economy.balance >= m && state.economy.balance < m + 1000) {
      events.push({
        type: 'revenue',
        message: `Company balance reached $${(m / 1000).toFixed(0)}K!`,
      })
    }
  }

  return events
}
