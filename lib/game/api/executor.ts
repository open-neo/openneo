import type { TaskExecutor, ExecutionMode, ApiCredentials } from './types'
import { SimulationExecutor } from './simulation'
import { RealExecutor } from './real/base'

// ─── Mode-aware executor factory ───

export function createExecutor(
  mode: ExecutionMode,
  credentials?: ApiCredentials,
): TaskExecutor {
  if (mode === 'simulation') {
    return new SimulationExecutor()
  }
  return new RealExecutor(credentials)
}
