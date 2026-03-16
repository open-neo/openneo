'use client'

import { useEffect, useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { ChatPanel } from '@/components/claude-chat/ChatPanel'
import { TokenSetup } from '@/components/claude-chat/TokenSetup'
import { useChatStore } from '@/lib/claude-chat/store'
import {
  loadTokenConfig,
  isEncryptedConfig,
} from '@/lib/claude-chat/crypto'
import { useTranslation } from '@/lib/i18n'

export default function ClaudeChatPage() {
  const { t } = useTranslation()
  const token = useChatStore((s) => s.token)
  const setToken = useChatStore((s) => s.setToken)
  const [checked, setChecked] = useState(false)

  // On mount, try to load plaintext token from storage
  useEffect(() => {
    if (token) {
      setChecked(true)
      return
    }
    const config = loadTokenConfig()
    if (config && !isEncryptedConfig(config)) {
      setToken(config.plain)
    }
    setChecked(true)
  }, [token, setToken])

  if (!checked) return null

  const hasToken = !!token

  return (
    <div className="flex h-full flex-col">
      <DashboardHeader title={t('claude.chat.title')} />
      <div className="flex-1 overflow-hidden">
        {hasToken ? <ChatPanel /> : <TokenSetup />}
      </div>
    </div>
  )
}
