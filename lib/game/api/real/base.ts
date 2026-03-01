import type { TaskDefinition, TaskResult } from '../../types'
import type { TaskExecutor, ApiCredentials } from '../types'

// ─── Real API executor (skeleton) ───
// In a full implementation, this would dispatch to actual API clients
// (OpenAI, Slack, Email, SNS) based on task type.

export class RealExecutor implements TaskExecutor {
  private credentials?: ApiCredentials

  constructor(credentials?: ApiCredentials) {
    this.credentials = credentials
  }

  async executeTask(task: TaskDefinition): Promise<TaskResult> {
    // TODO: Dispatch to real API clients based on task.type
    // For now, return a placeholder that indicates real mode is not yet configured

    console.warn(`[RealExecutor] Task "${task.title}" — real API execution not yet implemented`)

    return {
      taskId: task.id,
      success: false,
      output: 'Real mode execution is not yet configured. Please set up API credentials.',
      duration: 0,
      revenueGenerated: 0,
    }
  }

  async dryRun(task: TaskDefinition): Promise<{ wouldExecute: string; estimatedCost: number }> {
    const hasCredentials = this.credentials && Object.keys(this.credentials).length > 0
    return {
      wouldExecute: hasCredentials
        ? `[REAL] Would execute "${task.title}" via ${task.type} API`
        : `[REAL] Cannot execute "${task.title}" — no API credentials configured`,
      estimatedCost: hasCredentials ? 0.01 : 0,
    }
  }
}
