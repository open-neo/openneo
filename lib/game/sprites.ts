import type { AgentRole, AgentMood } from './types'

// ─── Placeholder colors per role ───

export const ROLE_COLORS: Record<AgentRole, number> = {
  developer: 0x4a90d9,
  sales: 0xe6a23c,
  marketer: 0xe06c75,
  finance: 0x56b6c2,
  hr: 0xc678dd,
  support: 0x98c379,
  researcher: 0xd19a66,
}

// ─── Role labels (for placeholder rendering) ───

export const ROLE_LABELS: Record<AgentRole, string> = {
  developer: 'DEV',
  sales: 'SALES',
  marketer: 'MKT',
  finance: 'FIN',
  hr: 'HR',
  support: 'SUP',
  researcher: 'RES',
}

// ─── Mood → speech bubble icon mapping ───

export const MOOD_ICONS: Record<AgentMood, string> = {
  excellent: '★',
  good: '♪',
  neutral: '…',
  stressed: '!',
  critical: '!!',
}

// ─── Furniture colors ───

export const FURNITURE_COLORS: Record<string, number> = {
  desk: 0x8b6914,
  computer: 0x333333,
  whiteboard: 0xf0f0f0,
  plant: 0x228b22,
  coffee: 0x6b3a2a,
  bookshelf: 0x8b4513,
  printer: 0x666666,
}

// ─── Room floor colors ───

export const ROOM_FLOOR_COLORS: Record<string, number> = {
  lobby: 0xd4c5a9,
  dev: 0xc5ccd4,
  sales: 0xd4cec5,
  finance: 0xc5d4d0,
  hr: 0xd4c5d0,
  support: 0xc5d4c5,
  research: 0xd0d0d4,
  executive: 0xd4d0c5,
  breakroom: 0xd4d4c5,
}

// ─── Wall color ───

export const WALL_COLOR = 0x666680
export const GRID_LINE_COLOR = 0x999999
export const GRID_LINE_ALPHA = 0.15
