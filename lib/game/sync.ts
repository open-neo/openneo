'use client'

import { useEffect } from 'react'
import { useGameStore } from './store'
import { officeAgentToAgent } from './adapter'
import type { Agent } from '@/lib/mockData'

const LEGACY_KEY = 'OpenNeo-agents'

// ─── Sync office agents → legacy localStorage store ───

function syncToLegacyStore(agents: ReturnType<typeof useGameStore.getState>['agents']) {
  if (typeof window === 'undefined') return

  const legacyAgents: Agent[] = agents.map(officeAgentToAgent)
  try {
    localStorage.setItem(LEGACY_KEY, JSON.stringify(legacyAgents))
  } catch {
    // storage full — ignore
  }
}

// ─── React hook for cross-store synchronization ───

export function useStoreSync() {
  const agents = useGameStore((s) => s.agents)

  useEffect(() => {
    syncToLegacyStore(agents)
  }, [agents])
}
