'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ChatMessage, Conversation, ChatSettings } from './types'
import { DEFAULT_SETTINGS } from './types'

interface ChatStore {
  // State
  conversations: Conversation[]
  activeConversationId: string | null
  settings: ChatSettings
  isStreaming: boolean
  streamingText: string
  token: string | null // in-memory only, never persisted

  // Actions
  setToken: (token: string | null) => void
  createConversation: () => string
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  clearConversation: (id: string) => void
  setActiveConversation: (id: string | null) => void
  addMessage: (conversationId: string, message: ChatMessage) => void
  updateLastAssistantMessage: (conversationId: string, content: string) => void
  updateSettings: (patch: Partial<ChatSettings>) => void
  setStreaming: (streaming: boolean) => void
  setStreamingText: (text: string) => void
  appendStreamingText: (chunk: string) => void
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      settings: DEFAULT_SETTINGS,
      isStreaming: false,
      streamingText: '',
      token: null,

      setToken: (token) => set({ token }),

      createConversation: () => {
        const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        const conv: Conversation = {
          id,
          title: 'New Chat',
          messages: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        set((state) => ({
          conversations: [conv, ...state.conversations],
          activeConversationId: id,
        }))
        return id
      },

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          activeConversationId:
            state.activeConversationId === id ? null : state.activeConversationId,
        })),

      renameConversation: (id, title) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, title, updatedAt: new Date().toISOString() } : c
          ),
        })),

      clearConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, messages: [], updatedAt: new Date().toISOString() } : c
          ),
        })),

      setActiveConversation: (id) => set({ activeConversationId: id }),

      addMessage: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const messages = [...c.messages, message]
            // Auto-title from first user message
            const title =
              c.messages.length === 0 && message.role === 'user'
                ? message.content.slice(0, 40) + (message.content.length > 40 ? '...' : '')
                : c.title
            return { ...c, messages, title, updatedAt: new Date().toISOString() }
          }),
        })),

      updateLastAssistantMessage: (conversationId, content) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== conversationId) return c
            const messages = [...c.messages]
            const lastIdx = messages.findLastIndex((m) => m.role === 'assistant')
            if (lastIdx >= 0) {
              messages[lastIdx] = { ...messages[lastIdx], content }
            }
            return { ...c, messages, updatedAt: new Date().toISOString() }
          }),
        })),

      updateSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
        })),

      setStreaming: (streaming) => set({ isStreaming: streaming }),
      setStreamingText: (text) => set({ streamingText: text }),
      appendStreamingText: (chunk) =>
        set((state) => ({ streamingText: state.streamingText + chunk })),
    }),
    {
      name: 'OpenNeo-claude-chat',
      partialize: (state) => ({
        conversations: state.conversations.map((c) => ({
          ...c,
          messages: c.messages.slice(-100), // keep last 100 messages per conversation
        })),
        activeConversationId: state.activeConversationId,
        settings: state.settings,
      }),
    },
  ),
)
