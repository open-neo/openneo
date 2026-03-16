'use client'

import { memo } from 'react'
import { ChatAvatar } from './ChatAvatar'

interface MessageBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

function MessageBubbleInner({ role, content, isStreaming }: MessageBubbleProps) {
  return (
    <div
      className={`animate-slide-in-up flex gap-3 px-4 py-3 ${
        role === 'user' ? 'flex-row-reverse' : ''
      }`}
    >
      <ChatAvatar role={role} />
      <div
        className={`max-w-[75%] rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
          role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        } ${isStreaming ? 'border border-orange-300/30' : ''}`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
      </div>
    </div>
  )
}

export const MessageBubble = memo(MessageBubbleInner)
