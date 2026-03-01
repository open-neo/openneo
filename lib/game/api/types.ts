import type { TaskDefinition, TaskResult } from '../types'

// ─── Task Executor Interface ───
// All executors (simulation and real) implement this interface.

export interface TaskExecutor {
  executeTask(task: TaskDefinition): Promise<TaskResult>
  dryRun(task: TaskDefinition): Promise<{ wouldExecute: string; estimatedCost: number }>
}

// ─── Execution Mode ───

export type ExecutionMode = 'simulation' | 'real'

// ─── API Credentials ───

export interface ApiCredentials {
  openai?: { apiKey: string }
  slack?: { token: string; channel: string }
  email?: { smtp: string; user: string; password: string }
  sns?: { accessKey: string; secretKey: string; region: string }
}

// ─── Execution Log Entry ───

export interface ExecutionLogEntry {
  taskId: string
  timestamp: string
  mode: ExecutionMode
  input: string
  output: string
  success: boolean
  durationMs: number
  dryRun: boolean
}
