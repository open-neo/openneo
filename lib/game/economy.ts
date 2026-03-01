import type { OfficeAgent, GameEconomy, AgentRole } from './types'

// ─── Revenue generation per role per tick ───

const BASE_REVENUE_PER_TICK: Record<AgentRole, number> = {
  developer: 50,
  sales: 80,
  marketer: 40,
  finance: 20,
  hr: 10,
  support: 30,
  researcher: 35,
}

// ─── Mood multiplier ───

const MOOD_MULTIPLIER: Record<string, number> = {
  excellent: 1.5,
  good: 1.2,
  neutral: 1.0,
  stressed: 0.7,
  critical: 0.3,
}

// ─── Calculate revenue for a single agent tick ───

export function calculateAgentRevenue(agent: OfficeAgent): number {
  if (agent.status === 'blocked') return 0

  const baseRevenue = BASE_REVENUE_PER_TICK[agent.role]
  const levelBonus = 1 + (agent.stats.level - 1) * 0.1
  const performanceBonus = agent.stats.performance / 100
  const moodMultiplier = MOOD_MULTIPLIER[agent.mood] ?? 1
  const statusMultiplier = agent.status === 'running' ? 1 : 0.3

  return Math.round(baseRevenue * levelBonus * performanceBonus * moodMultiplier * statusMultiplier)
}

// ─── Calculate XP gained per tick ───

export function calculateXpGain(agent: OfficeAgent): number {
  if (agent.status === 'blocked') return 0
  const baseXp = agent.status === 'running' ? 3 : 1
  const moodMultiplier = MOOD_MULTIPLIER[agent.mood] ?? 1
  return Math.round(baseXp * moodMultiplier)
}

// ─── Check if agent should level up ───

export function getXpForLevel(level: number): number {
  return 100 * level
}

export function shouldLevelUp(agent: OfficeAgent): boolean {
  return agent.stats.experience >= getXpForLevel(agent.stats.level)
}

// ─── Level up stats improvement ───

export function applyLevelUp(agent: OfficeAgent): Partial<OfficeAgent> {
  const newLevel = agent.stats.level + 1
  return {
    stats: {
      ...agent.stats,
      level: newLevel,
      experience: agent.stats.experience - getXpForLevel(agent.stats.level),
      performance: Math.min(100, agent.stats.performance + Math.floor(Math.random() * 5) + 2),
      reliability: Math.min(100, agent.stats.reliability + Math.floor(Math.random() * 3) + 1),
      creativity: Math.min(100, agent.stats.creativity + Math.floor(Math.random() * 3) + 1),
    },
  }
}

// ─── Calculate daily cost ───

export function calculateDailyCost(agents: OfficeAgent[]): number {
  return agents.reduce((sum, a) => sum + Math.round(a.financials.salary / 30), 0)
}

// ─── Update economy for one tick ───

export function tickEconomy(
  economy: GameEconomy,
  agents: OfficeAgent[],
): { economy: GameEconomy; agentUpdates: Map<string, Partial<OfficeAgent>> } {
  const agentUpdates = new Map<string, Partial<OfficeAgent>>()
  let tickRevenue = 0

  for (const agent of agents) {
    const revenue = calculateAgentRevenue(agent)
    const xp = calculateXpGain(agent)
    tickRevenue += revenue

    const newFinancials = {
      ...agent.financials,
      revenueGenerated: agent.financials.revenueGenerated + revenue,
      costToDate: agent.financials.costToDate + Math.round(agent.financials.salary / 30 / 24),
    }
    newFinancials.roi = newFinancials.costToDate > 0
      ? ((newFinancials.revenueGenerated - newFinancials.costToDate) / newFinancials.costToDate) * 100
      : 0

    agentUpdates.set(agent.id, {
      financials: newFinancials,
      stats: {
        ...agent.stats,
        experience: agent.stats.experience + xp,
      },
    })
  }

  const dailyCost = calculateDailyCost(agents)
  const newEconomy: GameEconomy = {
    ...economy,
    balance: economy.balance + tickRevenue - Math.round(dailyCost / 24),
    monthlyRevenue: economy.monthlyRevenue + tickRevenue,
  }

  return { economy: newEconomy, agentUpdates }
}

// ─── Mood update (random fluctuation) ───

const MOODS = ['excellent', 'good', 'neutral', 'stressed', 'critical'] as const

export function randomMoodShift(currentMood: string): string {
  const idx = MOODS.indexOf(currentMood as typeof MOODS[number])
  if (idx === -1) return 'neutral'

  const roll = Math.random()
  if (roll < 0.6) return currentMood
  if (roll < 0.8) return MOODS[Math.max(0, idx - 1)]
  return MOODS[Math.min(MOODS.length - 1, idx + 1)]
}
