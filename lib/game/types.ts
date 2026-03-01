import type { Agent } from '@/lib/mockData'

// ─── Agent Roles ───

export const AGENT_ROLES = [
  'developer',
  'sales',
  'marketer',
  'finance',
  'hr',
  'support',
  'researcher',
] as const

export type AgentRole = (typeof AGENT_ROLES)[number]

// ─── Agent Mood ───

export const AGENT_MOODS = [
  'excellent',
  'good',
  'neutral',
  'stressed',
  'critical',
] as const

export type AgentMood = (typeof AGENT_MOODS)[number]

// ─── Room Types ───

export const ROOM_IDS = [
  'lobby',
  'dev',
  'sales',
  'finance',
  'hr',
  'support',
  'research',
  'executive',
  'breakroom',
] as const

export type RoomId = (typeof ROOM_IDS)[number]

// ─── Sprite Config ───

export interface SpriteConfig {
  spriteSheet: string
  frameWidth: number
  frameHeight: number
  tint: number
}

// ─── Agent Stats ───

export interface AgentStats {
  level: number
  experience: number
  performance: number
  tasksCompleted: number
  reliability: number
  creativity: number
}

// ─── Agent Financials ───

export interface AgentFinancials {
  salary: number
  revenueGenerated: number
  costToDate: number
  roi: number
}

// ─── Thought Log ───

export interface ThoughtEntry {
  timestamp: string
  text: string
  type: 'working' | 'idle' | 'success' | 'error' | 'idea'
}

// ─── Deliverable ───

export interface Deliverable {
  id: string
  title: string
  completedAt: string
  quality: number
  revenueImpact: number
}

// ─── Office Agent ───

export interface OfficeAgent extends Agent {
  role: AgentRole
  roomId: RoomId
  gridPosition: { x: number; y: number }
  sprite: SpriteConfig
  stats: AgentStats
  financials: AgentFinancials
  hiredAt: string
  thoughtLog: ThoughtEntry[]
  deliverables: Deliverable[]
  mood: AgentMood
}

// ─── Room ───

export interface Room {
  id: RoomId
  name: string
  unlocked: boolean
  unlockCost: number
  gridBounds: { x: number; y: number; width: number; height: number }
  capacity: number
  furniture: FurnitureItem[]
}

// ─── Furniture ───

export interface FurnitureItem {
  id: string
  type: 'desk' | 'computer' | 'whiteboard' | 'plant' | 'coffee' | 'bookshelf' | 'printer'
  gridPosition: { x: number; y: number }
  gridSize: { width: number; height: number }
}

// ─── Economy ───

export interface GameEconomy {
  balance: number
  monthlyRevenue: number
  monthlyCost: number
  customers: number
  reputation: number
}

// ─── Events ───

export type GameEventType =
  | 'hire'
  | 'fire'
  | 'levelup'
  | 'revenue'
  | 'expense'
  | 'task_complete'
  | 'task_fail'
  | 'room_unlock'
  | 'mood_change'
  | 'random'

export interface GameEvent {
  id: string
  type: GameEventType
  message: string
  timestamp: string
  agentId?: string
  data?: Record<string, unknown>
}

// ─── Task Definition ───

export interface TaskDefinition {
  id: string
  title: string
  description: string
  assignedAgentId: string
  type: 'code' | 'sales_call' | 'email' | 'research' | 'report' | 'support_ticket'
  estimatedTicks: number
  revenueOnComplete: number
}

// ─── Task Result ───

export interface TaskResult {
  taskId: string
  success: boolean
  output: string
  duration: number
  revenueGenerated: number
}

// ─── Game State ───

export interface GameState {
  mode: 'simulation' | 'real'
  economy: GameEconomy
  rooms: Room[]
  agents: OfficeAgent[]
  events: GameEvent[]
  tasks: TaskDefinition[]
  timeScale: 1 | 2 | 4
  isPaused: boolean
  gameDay: number
  selectedAgentId: string | null
}

// ─── Game Actions (Zustand) ───

export interface GameActions {
  // Agent actions
  hireAgent: (agent: OfficeAgent) => void
  fireAgent: (agentId: string) => void
  updateAgent: (agentId: string, patch: Partial<OfficeAgent>) => void
  selectAgent: (agentId: string | null) => void

  // Room actions
  unlockRoom: (roomId: RoomId) => void

  // Economy actions
  updateEconomy: (patch: Partial<GameEconomy>) => void
  addRevenue: (amount: number) => void
  addExpense: (amount: number) => void

  // Event actions
  addEvent: (event: Omit<GameEvent, 'id' | 'timestamp'>) => void
  clearEvents: () => void

  // Task actions
  addTask: (task: TaskDefinition) => void
  removeTask: (taskId: string) => void

  // Time controls
  setTimeScale: (scale: 1 | 2 | 4) => void
  togglePause: () => void
  advanceDay: () => void

  // Mode
  setMode: (mode: 'simulation' | 'real') => void

  // Bulk
  setGameState: (state: Partial<GameState>) => void
}

export type GameStore = GameState & GameActions
