'use client'

import { User } from 'lucide-react'

export function ChatAvatar({ role }: { role: 'user' | 'assistant' }) {
  if (role === 'assistant') {
    return (
      <div className="animate-float flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 text-white pixel-font text-xs font-bold shadow-sm">
        C
      </div>
    )
  }

  return (
    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
      <User className="size-4 text-muted-foreground" />
    </div>
  )
}
