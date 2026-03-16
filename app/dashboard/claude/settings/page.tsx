'use client'

import { useCallback, useState } from 'react'
import { Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChatStore } from '@/lib/claude-chat/store'
import { AVAILABLE_MODELS } from '@/lib/claude-chat/types'
import {
  encryptToken,
  saveTokenPlain,
  saveTokenEncrypted,
  loadTokenConfig,
  clearToken,
  isEncryptedConfig,
  decryptToken,
} from '@/lib/claude-chat/crypto'
import { useTranslation } from '@/lib/i18n'

type ValidateState = 'idle' | 'loading' | 'success' | 'error'

export default function ClaudeSettingsPage() {
  const { t } = useTranslation()
  const settings = useChatStore((s) => s.settings)
  const updateSettings = useChatStore((s) => s.updateSettings)
  const setToken = useChatStore((s) => s.setToken)
  const token = useChatStore((s) => s.token)

  const [tokenInput, setTokenInput] = useState(token ?? '')
  const [showToken, setShowToken] = useState(false)
  const [usePin, setUsePin] = useState(false)
  const [pin, setPin] = useState('')
  const [validateState, setValidateState] = useState<ValidateState>('idle')
  const [validateError, setValidateError] = useState('')

  // Load existing config on mount to detect if PIN-encrypted
  const [hasExistingConfig] = useState(() => {
    if (typeof window === 'undefined') return false
    const config = loadTokenConfig()
    return config !== null && isEncryptedConfig(config)
  })

  const handleSaveToken = useCallback(async () => {
    const trimmed = tokenInput.trim()
    if (!trimmed) {
      clearToken()
      setToken(null)
      return
    }

    if (!trimmed.startsWith('sk-ant-')) {
      setValidateError(t('claude.settings.invalidPrefix'))
      setValidateState('error')
      return
    }

    if (usePin && pin.length >= 4) {
      const config = await encryptToken(trimmed, pin)
      saveTokenEncrypted(config)
    } else {
      saveTokenPlain(trimmed)
    }
    setToken(trimmed)
  }, [tokenInput, usePin, pin, setToken, t])

  const handleValidate = useCallback(async () => {
    if (!tokenInput.trim()) return

    setValidateState('loading')
    setValidateError('')

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Hi' }],
          model: settings.model,
          maxTokens: 16,
          apiKey: tokenInput.trim(),
        }),
      })

      if (res.ok) {
        setValidateState('success')
        // Auto-save on successful validation
        await handleSaveToken()
      } else {
        const err = await res.json().catch(() => ({ error: 'Validation failed' }))
        setValidateError(err.error || 'Validation failed')
        setValidateState('error')
      }
    } catch {
      setValidateError('Network error')
      setValidateState('error')
    }
  }, [tokenInput, settings.model, handleSaveToken])

  const handleUnlockPin = useCallback(async () => {
    const config = loadTokenConfig()
    if (!config || !isEncryptedConfig(config)) return
    try {
      const decrypted = await decryptToken(config, pin)
      setToken(decrypted)
      setTokenInput(decrypted)
    } catch {
      setValidateError(t('claude.settings.wrongPin'))
      setValidateState('error')
    }
  }, [pin, setToken, t])

  return (
    <>
      <DashboardHeader title={t('claude.settings.title')} />
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* API Token */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('claude.settings.apiToken')}</CardTitle>
              <CardDescription>{t('claude.settings.apiTokenDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasExistingConfig && !token ? (
                <div className="space-y-3">
                  <Label>{t('claude.settings.enterPin')}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="PIN"
                      className="max-w-[200px]"
                    />
                    <Button onClick={handleUnlockPin} disabled={pin.length < 4}>
                      {t('claude.settings.unlock')}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>{t('claude.settings.token')}</Label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Input
                          type={showToken ? 'text' : 'password'}
                          value={tokenInput}
                          onChange={(e) => {
                            setTokenInput(e.target.value)
                            setValidateState('idle')
                          }}
                          placeholder="sk-ant-..."
                          className="pr-10"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
                          onClick={() => setShowToken(!showToken)}
                        >
                          {showToken ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleValidate}
                        disabled={!tokenInput.trim() || validateState === 'loading'}
                      >
                        {validateState === 'loading' && (
                          <Loader2 className="mr-2 size-4 animate-spin" />
                        )}
                        {validateState === 'success' && (
                          <CheckCircle2 className="mr-2 size-4 text-green-500" />
                        )}
                        {validateState === 'error' && (
                          <XCircle className="mr-2 size-4 text-destructive" />
                        )}
                        {t('claude.settings.validate')}
                      </Button>
                    </div>
                    {validateState === 'error' && validateError && (
                      <p className="text-xs text-destructive">{validateError}</p>
                    )}
                    {validateState === 'success' && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {t('claude.settings.validateSuccess')}
                      </p>
                    )}
                  </div>

                  {/* PIN Encryption */}
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="text-sm font-medium">{t('claude.settings.pinEncryption')}</p>
                      <p className="text-xs text-muted-foreground">
                        {t('claude.settings.pinEncryptionDesc')}
                      </p>
                    </div>
                    <Switch checked={usePin} onCheckedChange={setUsePin} />
                  </div>
                  {usePin && (
                    <Input
                      type="password"
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder={t('claude.settings.pinPlaceholder')}
                      className="max-w-[200px]"
                    />
                  )}

                  <Button onClick={handleSaveToken} disabled={!tokenInput.trim()}>
                    {t('common.save')}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Model Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t('claude.settings.modelSettings')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t('claude.settings.model')}</Label>
                <Select
                  value={settings.model}
                  onValueChange={(v) => updateSettings({ model: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABLE_MODELS.map((m) => (
                      <SelectItem key={m.id} value={m.id}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>{t('claude.settings.maxTokens')}</Label>
                  <span className="text-xs text-muted-foreground">
                    {settings.maxTokens.toLocaleString()}
                  </span>
                </div>
                <Slider
                  value={[settings.maxTokens]}
                  onValueChange={([v]) => updateSettings({ maxTokens: v })}
                  min={1024}
                  max={32768}
                  step={1024}
                />
              </div>

              <div className="space-y-2">
                <Label>{t('claude.settings.systemPrompt')}</Label>
                <Textarea
                  value={settings.systemPrompt}
                  onChange={(e) => updateSettings({ systemPrompt: e.target.value })}
                  placeholder={t('claude.settings.systemPromptPlaceholder')}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
