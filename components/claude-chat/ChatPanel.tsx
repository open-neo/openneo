'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Send, Square } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/lib/claude-chat/store'
import { useTranslation } from '@/lib/i18n'
import { ConversationList } from './ConversationList'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import type { StreamChunk } from '@/lib/claude-chat/types'

export function ChatPanel() {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const conversations = useChatStore((s) => s.conversations)
  const activeId = useChatStore((s) => s.activeConversationId)
  const settings = useChatStore((s) => s.settings)
  const isStreaming = useChatStore((s) => s.isStreaming)
  const streamingText = useChatStore((s) => s.streamingText)
  const token = useChatStore((s) => s.token)
  const createConversation = useChatStore((s) => s.createConversation)
  const addMessage = useChatStore((s) => s.addMessage)
  const updateLastAssistantMessage = useChatStore((s) => s.updateLastAssistantMessage)
  const setStreaming = useChatStore((s) => s.setStreaming)
  const setStreamingText = useChatStore((s) => s.setStreamingText)
  const appendStreamingText = useChatStore((s) => s.appendStreamingText)

  const activeConversation = conversations.find((c) => c.id === activeId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversation?.messages, streamingText])

  const handleSend = useCallback(async () => {
    if (!input.trim() || !token || isStreaming) return

    let convId = activeId
    if (!convId) {
      convId = createConversation()
    }

    const userMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      role: 'user' as const,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    addMessage(convId, userMessage)
    setInput('')

    // Get the current conversation messages for context
    const conv = useChatStore.getState().conversations.find((c) => c.id === convId)
    const apiMessages = (conv?.messages ?? []).map((m) => ({
      role: m.role,
      content: m.content,
    }))

    // Add placeholder assistant message
    const assistantId = `msg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`
    addMessage(convId, {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    })

    setStreaming(true)
    setStreamingText('')

    const abort = new AbortController()
    abortRef.current = abort

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          model: settings.model,
          maxTokens: settings.maxTokens,
          systemPrompt: settings.systemPrompt || undefined,
          apiKey: token,
        }),
        signal: abort.signal,
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Request failed' }))
        updateLastAssistantMessage(convId, `Error: ${err.error || res.statusText}`)
        setStreaming(false)
        return
      }

      const reader = res.body?.getReader()
      if (!reader) {
        updateLastAssistantMessage(convId, 'Error: No response stream')
        setStreaming(false)
        return
      }

      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const text = decoder.decode(value, { stream: true })
        const lines = text.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const chunk: StreamChunk = JSON.parse(line.slice(6))
            if (chunk.type === 'text_delta' && chunk.text) {
              accumulated += chunk.text
              appendStreamingText(chunk.text)
              updateLastAssistantMessage(convId, accumulated)
            } else if (chunk.type === 'error') {
              updateLastAssistantMessage(convId, `Error: ${chunk.error}`)
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        updateLastAssistantMessage(
          convId,
          `Error: ${(err as Error).message || 'Connection failed'}`
        )
      }
    } finally {
      setStreaming(false)
      setStreamingText('')
      abortRef.current = null
    }
  }, [
    input,
    token,
    isStreaming,
    activeId,
    settings,
    createConversation,
    addMessage,
    updateLastAssistantMessage,
    setStreaming,
    setStreamingText,
    appendStreamingText,
  ])

  const handleStop = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-full">
      {/* Conversation sidebar */}
      <div className="hidden w-64 shrink-0 md:block">
        <ConversationList />
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {/* Messages */}
        <div className="chat-grid-bg flex-1 overflow-y-auto">
          {!activeConversation || activeConversation.messages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-2">
                <div className="animate-float mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-amber-500 text-white pixel-font text-2xl font-bold shadow-lg">
                  C
                </div>
                <p className="text-sm text-muted-foreground">
                  {t('claude.chat.emptyState')}
                </p>
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl py-4">
              {activeConversation.messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  isStreaming={
                    isStreaming &&
                    msg.role === 'assistant' &&
                    msg.id === activeConversation.messages[activeConversation.messages.length - 1]?.id
                  }
                />
              ))}
              {isStreaming && streamingText === '' && (
                <div className="px-4 py-2">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="border-t bg-background p-4">
          <div className="mx-auto flex max-w-3xl items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('claude.chat.inputPlaceholder')}
              disabled={!token || isStreaming}
              className="min-h-[44px] max-h-[160px] resize-none"
              rows={1}
            />
            {isStreaming ? (
              <Button
                variant="destructive"
                size="icon"
                className="shrink-0"
                onClick={handleStop}
              >
                <Square className="size-4" />
              </Button>
            ) : (
              <Button
                size="icon"
                className="shrink-0"
                onClick={handleSend}
                disabled={!input.trim() || !token}
              >
                <Send className="size-4" />
              </Button>
            )}
          </div>
          <p className="mx-auto mt-1.5 max-w-3xl text-[10px] text-muted-foreground">
            {settings.model.includes('opus')
              ? 'Opus 4'
              : settings.model.includes('haiku')
                ? 'Haiku 4'
                : 'Sonnet 4'}
            {' · '}
            {t('claude.chat.maxTokens')}: {settings.maxTokens.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
