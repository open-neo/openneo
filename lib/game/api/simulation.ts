import type { TaskDefinition, TaskResult } from '../types'
import type { TaskExecutor } from './types'

// ─── Simulated task outputs by type ───

const SIMULATED_OUTPUTS: Record<string, string[]> = {
  code: [
    'Implemented feature successfully. 12 files changed, 340 insertions, 89 deletions.',
    'Refactored module. Performance improved by 23%.',
    'Fixed 3 bugs in the authentication flow. All tests passing.',
    'Created API endpoint with full test coverage.',
  ],
  sales_call: [
    'Called prospect. Meeting scheduled for next week.',
    'Demo completed. Prospect is evaluating the proposal.',
    'Closed deal! New contract signed for $12,000/year.',
    'Follow-up sent. Waiting for decision maker.',
  ],
  email: [
    'Newsletter sent to 2,500 subscribers. Open rate: 34%.',
    'Cold outreach batch sent. 15 responses received.',
    'Support email resolved. Customer satisfied.',
    'Invoice email sent and acknowledged.',
  ],
  research: [
    'Market analysis complete. Found 3 untapped segments.',
    'Competitor report generated. Key differentiators identified.',
    'Data analysis reveals 18% improvement opportunity.',
    'Research paper reviewed and summarized.',
  ],
  report: [
    'Monthly financial report generated. Revenue up 12%.',
    'Quarterly OKR report compiled. 78% completion rate.',
    'Team performance report ready for review.',
    'Analytics dashboard updated with latest metrics.',
  ],
  support_ticket: [
    'Ticket resolved: Password reset assisted.',
    'Bug report triaged and assigned to dev team.',
    'Feature request documented and added to backlog.',
    'Customer onboarding issue resolved. Guide updated.',
  ],
}

function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export class SimulationExecutor implements TaskExecutor {
  async executeTask(task: TaskDefinition): Promise<TaskResult> {
    // Simulate work duration
    const delay = 500 + Math.random() * 1500
    await new Promise((resolve) => setTimeout(resolve, delay))

    const success = Math.random() > 0.1
    const outputs = SIMULATED_OUTPUTS[task.type] ?? ['Task completed.']
    const output = success ? randomPick(outputs) : 'Task failed due to unexpected error.'
    const revenueGenerated = success ? task.revenueOnComplete * (0.8 + Math.random() * 0.4) : 0

    return {
      taskId: task.id,
      success,
      output,
      duration: Math.round(delay),
      revenueGenerated: Math.round(revenueGenerated),
    }
  }

  async dryRun(task: TaskDefinition): Promise<{ wouldExecute: string; estimatedCost: number }> {
    return {
      wouldExecute: `[SIMULATION] Would execute "${task.title}" (${task.type})`,
      estimatedCost: 0,
    }
  }
}
