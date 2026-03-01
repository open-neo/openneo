import type { Agent } from '@/lib/mockData'
import { generateId } from '@/lib/mockData'
import type { OfficeAgent, AgentRole, RoomId, SpriteConfig } from './types'

// ─── Role → Room mapping ───

const ROLE_ROOM_MAP: Record<AgentRole, RoomId> = {
  developer: 'dev',
  sales: 'sales',
  marketer: 'sales',
  finance: 'finance',
  hr: 'hr',
  support: 'support',
  researcher: 'research',
}

// ─── Role → Sprite tint (placeholder colors) ───

const ROLE_TINTS: Record<AgentRole, number> = {
  developer: 0x4a90d9,
  sales: 0xe6a23c,
  marketer: 0xe06c75,
  finance: 0x56b6c2,
  hr: 0xc678dd,
  support: 0x98c379,
  researcher: 0xd19a66,
}

// ─── Default sprite config ───

function defaultSprite(role: AgentRole): SpriteConfig {
  return {
    spriteSheet: `agents/${role}`,
    frameWidth: 16,
    frameHeight: 24,
    tint: ROLE_TINTS[role],
  }
}

// ─── Agent → OfficeAgent ───

export function agentToOfficeAgent(
  agent: Agent,
  role: AgentRole = 'developer',
  gridPosition?: { x: number; y: number },
): OfficeAgent {
  const roomId = ROLE_ROOM_MAP[role]

  return {
    ...agent,
    role,
    roomId,
    gridPosition: gridPosition ?? { x: 0, y: 0 },
    sprite: defaultSprite(role),
    stats: {
      level: 1,
      experience: 0,
      performance: 50,
      tasksCompleted: 0,
      reliability: 50,
      creativity: 50,
    },
    financials: {
      salary: getSalaryForRole(role),
      revenueGenerated: 0,
      costToDate: 0,
      roi: 0,
    },
    hiredAt: new Date().toISOString(),
    thoughtLog: [],
    deliverables: [],
    mood: 'neutral',
  }
}

// ─── OfficeAgent → Agent (for legacy store sync) ───

export function officeAgentToAgent(officeAgent: OfficeAgent): Agent {
  return {
    id: officeAgent.id,
    name: officeAgent.name,
    status: officeAgent.status,
    okr: officeAgent.okr,
    cpuPercent: officeAgent.cpuPercent,
    ramMB: officeAgent.ramMB,
    network: officeAgent.network,
    lastAction: officeAgent.lastAction,
    skills: officeAgent.skills,
    permissions: officeAgent.permissions,
    recentActions: officeAgent.recentActions,
    openAtLogin: officeAgent.openAtLogin,
  }
}

// ─── Create a fresh OfficeAgent ───

export function createOfficeAgent(
  name: string,
  role: AgentRole,
  gridPosition?: { x: number; y: number },
): OfficeAgent {
  const baseAgent: Agent = {
    id: generateId(),
    name,
    status: 'idle',
    okr: '',
    cpuPercent: 0,
    ramMB: 0,
    network: 'local',
    lastAction: 'Hired',
    skills: getDefaultSkills(role),
    permissions: [],
    recentActions: [{ time: new Date().toISOString(), action: 'Hired' }],
    openAtLogin: false,
  }

  return agentToOfficeAgent(baseAgent, role, gridPosition)
}

// ─── Role-based defaults ───

function getSalaryForRole(role: AgentRole): number {
  const salaries: Record<AgentRole, number> = {
    developer: 8000,
    sales: 6000,
    marketer: 5500,
    finance: 7000,
    hr: 5000,
    support: 4500,
    researcher: 7500,
  }
  return salaries[role]
}

function getDefaultSkills(role: AgentRole): string[] {
  const skills: Record<AgentRole, string[]> = {
    developer: ['coding', 'debugging', 'code-review'],
    sales: ['outreach', 'negotiation', 'crm'],
    marketer: ['content', 'analytics', 'social-media'],
    finance: ['accounting', 'forecasting', 'reporting'],
    hr: ['recruiting', 'onboarding', 'culture'],
    support: ['troubleshooting', 'documentation', 'triage'],
    researcher: ['analysis', 'data-mining', 'synthesis'],
  }
  return skills[role]
}
