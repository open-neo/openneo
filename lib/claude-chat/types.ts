export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
}

export interface ChatSettings {
  model: string
  maxTokens: number
  systemPrompt: string
}

export interface TokenConfig {
  encrypted: string
  iv: string
  salt: string
  hasPin: boolean
}

export const DEFAULT_SETTINGS: ChatSettings = {
  model: 'claude-sonnet-4-20250514',
  maxTokens: 8192,
  systemPrompt: '',
}

export interface StreamChunk {
  type: 'text_delta' | 'message_stop' | 'error'
  text?: string
  error?: string
}

export interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[]
  model: string
  maxTokens: number
  systemPrompt?: string
  apiKey: string
}

export const AVAILABLE_MODELS = [
  { id: 'claude-opus-4-20250514', label: 'Claude Opus 4' },
  { id: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
  { id: 'claude-haiku-4-20250506', label: 'Claude Haiku 4' },
] as const
