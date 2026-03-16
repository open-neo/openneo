'use client'

import { Plus, MessageSquare, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChatStore } from '@/lib/claude-chat/store'
import { useTranslation } from '@/lib/i18n'

export function ConversationList() {
  const { t } = useTranslation()
  const conversations = useChatStore((s) => s.conversations)
  const activeId = useChatStore((s) => s.activeConversationId)
  const createConversation = useChatStore((s) => s.createConversation)
  const setActive = useChatStore((s) => s.setActiveConversation)
  const deleteConversation = useChatStore((s) => s.deleteConversation)

  return (
    <div className="flex h-full flex-col border-r">
      <div className="flex items-center justify-between border-b p-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {t('claude.chat.conversations')}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={() => createConversation()}
        >
          <Plus className="size-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-0.5">
          {conversations.length === 0 && (
            <p className="px-2 py-8 text-center text-xs text-muted-foreground">
              {t('claude.chat.noConversations')}
            </p>
          )}
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className={`group flex items-center gap-2 rounded-md px-2.5 py-2 text-sm cursor-pointer transition-colors ${
                activeId === conv.id
                  ? 'bg-accent text-accent-foreground'
                  : 'hover:bg-muted'
              }`}
              onClick={() => setActive(conv.id)}
            >
              <MessageSquare className="size-3.5 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate">{conv.title}</span>
              <Button
                variant="ghost"
                size="icon"
                className="size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteConversation(conv.id)
                }}
              >
                <Trash2 className="size-3 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
