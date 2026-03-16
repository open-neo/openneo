'use client'

import { useEffect } from 'react'
import { useChatStore } from './store'

export type AgentAnimationState = 'idle' | 'working' | 'done'

/** Derive animation state from chat store streaming state */
export function useAgentAnimationState(): AgentAnimationState {
  const isStreaming = useChatStore((s) => s.isStreaming)
  return isStreaming ? 'working' : 'idle'
}

/**
 * Hook to sync chat events to the game store.
 * Dispatches game events when messages are sent/received.
 */
export function useChatGameSync() {
  const isStreaming = useChatStore((s) => s.isStreaming)

  useEffect(() => {
    // Could dispatch game store events here
    // e.g. useGameStore.getState().addEvent(...)
  }, [isStreaming])
}
