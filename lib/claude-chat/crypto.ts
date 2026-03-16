import type { TokenConfig } from './types'

const STORAGE_KEY = 'OpenNeo-claude-token'

async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    'PBKDF2',
    false,
    ['deriveKey'],
  )
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export async function encryptToken(token: string, pin: string): Promise<TokenConfig> {
  const salt = crypto.getRandomValues(new Uint8Array(16))
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const key = await deriveKey(pin, salt)
  const enc = new TextEncoder()
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(token),
  )
  return {
    encrypted: btoa(String.fromCharCode(...new Uint8Array(ciphertext))),
    iv: btoa(String.fromCharCode(...iv)),
    salt: btoa(String.fromCharCode(...salt)),
    hasPin: true,
  }
}

export async function decryptToken(config: TokenConfig, pin: string): Promise<string> {
  const salt = Uint8Array.from(atob(config.salt), (c) => c.charCodeAt(0))
  const iv = Uint8Array.from(atob(config.iv), (c) => c.charCodeAt(0))
  const ciphertext = Uint8Array.from(atob(config.encrypted), (c) => c.charCodeAt(0))
  const key = await deriveKey(pin, salt)
  const plaintext = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext,
  )
  return new TextDecoder().decode(plaintext)
}

/** Store token plaintext (no PIN) or encrypted config */
export function saveTokenPlain(token: string): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ plain: token }))
}

export function saveTokenEncrypted(config: TokenConfig): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

export function loadTokenConfig(): TokenConfig | { plain: string } | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearToken(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function isEncryptedConfig(
  config: TokenConfig | { plain: string },
): config is TokenConfig {
  return 'encrypted' in config
}
