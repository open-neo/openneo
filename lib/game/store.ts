'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { GameStore, GameState, GameEvent, OfficeAgent, RoomId, GameEconomy, TaskDefinition } from './types'
import { DEFAULT_ROOMS } from './rooms'

const INITIAL_STATE: GameState = {
  mode: 'simulation',
  economy: {
    balance: 100000,
    monthlyRevenue: 0,
    monthlyCost: 0,
    customers: 0,
    reputation: 50,
  },
  rooms: DEFAULT_ROOMS,
  agents: [],
  events: [],
  tasks: [],
  timeScale: 1,
  isPaused: false,
  gameDay: 1,
  selectedAgentId: null,
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      // ── Agent actions ──

      hireAgent: (agent: OfficeAgent) =>
        set((state) => ({
          agents: [...state.agents, agent],
          economy: {
            ...state.economy,
            monthlyCost: state.economy.monthlyCost + agent.financials.salary,
          },
        })),

      fireAgent: (agentId: string) =>
        set((state) => {
          const agent = state.agents.find((a) => a.id === agentId)
          return {
            agents: state.agents.filter((a) => a.id !== agentId),
            economy: {
              ...state.economy,
              monthlyCost: state.economy.monthlyCost - (agent?.financials.salary ?? 0),
            },
            selectedAgentId: state.selectedAgentId === agentId ? null : state.selectedAgentId,
          }
        }),

      updateAgent: (agentId: string, patch: Partial<OfficeAgent>) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === agentId ? { ...a, ...patch } : a,
          ),
        })),

      selectAgent: (agentId: string | null) =>
        set({ selectedAgentId: agentId }),

      // ── Room actions ──

      unlockRoom: (roomId: RoomId) =>
        set((state) => {
          const room = state.rooms.find((r) => r.id === roomId)
          if (!room || room.unlocked || state.economy.balance < room.unlockCost) return state
          return {
            rooms: state.rooms.map((r) =>
              r.id === roomId ? { ...r, unlocked: true } : r,
            ),
            economy: {
              ...state.economy,
              balance: state.economy.balance - room.unlockCost,
            },
          }
        }),

      // ── Economy actions ──

      updateEconomy: (patch: Partial<GameEconomy>) =>
        set((state) => ({
          economy: { ...state.economy, ...patch },
        })),

      addRevenue: (amount: number) =>
        set((state) => ({
          economy: {
            ...state.economy,
            balance: state.economy.balance + amount,
            monthlyRevenue: state.economy.monthlyRevenue + amount,
          },
        })),

      addExpense: (amount: number) =>
        set((state) => ({
          economy: {
            ...state.economy,
            balance: state.economy.balance - amount,
          },
        })),

      // ── Event actions ──

      addEvent: (event: Omit<GameEvent, 'id' | 'timestamp'>) =>
        set((state) => ({
          events: [
            {
              ...event,
              id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              timestamp: new Date().toISOString(),
            },
            ...state.events.slice(0, 99),
          ],
        })),

      clearEvents: () => set({ events: [] }),

      // ── Task actions ──

      addTask: (task: TaskDefinition) =>
        set((state) => ({ tasks: [...state.tasks, task] })),

      removeTask: (taskId: string) =>
        set((state) => ({ tasks: state.tasks.filter((t) => t.id !== taskId) })),

      // ── Time controls ──

      setTimeScale: (scale: 1 | 2 | 4) => set({ timeScale: scale }),

      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

      advanceDay: () => set((state) => ({ gameDay: state.gameDay + 1 })),

      // ── Mode ──

      setMode: (mode: 'simulation' | 'real') => set({ mode }),

      // ── Bulk ──

      setGameState: (patch: Partial<GameState>) => set(patch),
    }),
    {
      name: 'OpenNeo-game',
      partialize: (state) => ({
        mode: state.mode,
        economy: state.economy,
        rooms: state.rooms,
        agents: state.agents,
        events: state.events.slice(0, 50),
        tasks: state.tasks,
        timeScale: state.timeScale,
        gameDay: state.gameDay,
      }),
    },
  ),
)
