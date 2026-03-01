'use client'

import { useEffect, useRef } from 'react'
import { GameLoop } from '@/lib/game/engine/GameLoop'
import { useGameStore } from '@/lib/game/store'
import { tickEconomy, shouldLevelUp, applyLevelUp, randomMoodShift } from '@/lib/game/economy'
import { generateTickEvents, checkMilestones } from '@/lib/game/events'
import type { AgentMood } from '@/lib/game/types'

const SPEED_TO_MS: Record<number, number> = {
  1: 2000,
  2: 1000,
  4: 500,
}

export function useGameTick() {
  const gameLoopRef = useRef<GameLoop | null>(null)
  const tickCountRef = useRef(0)

  const isPaused = useGameStore((s) => s.isPaused)
  const timeScale = useGameStore((s) => s.timeScale)

  useEffect(() => {
    const gameLoop = new GameLoop()
    gameLoopRef.current = gameLoop

    const unsubscribe = gameLoop.onTick(() => {
      const state = useGameStore.getState()
      if (state.isPaused || state.agents.length === 0) return

      tickCountRef.current++

      // Economy tick
      const { economy, agentUpdates } = tickEconomy(state.economy, state.agents)
      state.updateEconomy(economy)

      // Apply agent updates (XP, financials)
      for (const [agentId, update] of agentUpdates) {
        state.updateAgent(agentId, update)
      }

      // Check level-ups
      for (const agent of state.agents) {
        const updatedAgent = { ...agent, ...agentUpdates.get(agent.id) }
        if (shouldLevelUp(updatedAgent as typeof agent)) {
          const levelUpPatch = applyLevelUp(updatedAgent as typeof agent)
          state.updateAgent(agent.id, levelUpPatch)
          state.addEvent({
            type: 'levelup',
            message: `${agent.name} leveled up to Lv.${(levelUpPatch.stats?.level ?? agent.stats.level)}!`,
            agentId: agent.id,
          })
        }
      }

      // Mood shifts (every 10 ticks)
      if (tickCountRef.current % 10 === 0) {
        for (const agent of state.agents) {
          const newMood = randomMoodShift(agent.mood)
          if (newMood !== agent.mood) {
            state.updateAgent(agent.id, { mood: newMood as AgentMood })
          }
        }
      }

      // Random events
      const events = generateTickEvents(useGameStore.getState())
      for (const event of events) {
        state.addEvent(event)
      }

      // Day advancement (every 24 ticks = 1 game day)
      if (tickCountRef.current % 24 === 0) {
        state.advanceDay()

        // Reset monthly counters at day 30
        if (state.gameDay % 30 === 0) {
          state.updateEconomy({
            monthlyRevenue: 0,
            monthlyCost: state.agents.reduce((sum, a) => sum + a.financials.salary, 0),
          })
        }

        // Customer growth
        const newCustomers = state.agents
          .filter((a) => a.role === 'sales' || a.role === 'marketer')
          .reduce((sum, a) => sum + Math.floor(Math.random() * a.stats.level), 0)
        if (newCustomers > 0) {
          state.updateEconomy({ customers: state.economy.customers + newCustomers })
        }

        // Milestones
        const milestones = checkMilestones(useGameStore.getState())
        for (const m of milestones) {
          state.addEvent(m)
        }
      }

      // Auto-set agents to running if idle (simulate them starting to work)
      for (const agent of state.agents) {
        if (agent.status === 'idle' && Math.random() < 0.3) {
          state.updateAgent(agent.id, { status: 'running' })
        } else if (agent.status === 'running' && Math.random() < 0.05) {
          state.updateAgent(agent.id, { status: 'idle' })
        }
      }
    })

    gameLoop.start(SPEED_TO_MS[1])

    return () => {
      unsubscribe()
      gameLoop.destroy()
    }
  }, [])

  // Respond to pause/speed changes
  useEffect(() => {
    const loop = gameLoopRef.current
    if (!loop) return

    if (isPaused) {
      loop.stop()
    } else {
      loop.stop()
      loop.start(SPEED_TO_MS[timeScale] ?? 2000)
    }
  }, [isPaused, timeScale])
}
