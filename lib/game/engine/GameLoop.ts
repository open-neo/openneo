export type TickCallback = (delta: number) => void

export class GameLoop {
  private callbacks: TickCallback[] = []
  private intervalId: ReturnType<typeof setInterval> | null = null
  private _running = false

  get running(): boolean {
    return this._running
  }

  onTick(callback: TickCallback): () => void {
    this.callbacks.push(callback)
    return () => {
      this.callbacks = this.callbacks.filter((cb) => cb !== callback)
    }
  }

  start(intervalMs: number = 1000): void {
    if (this._running) return
    this._running = true

    this.intervalId = setInterval(() => {
      for (const cb of this.callbacks) {
        cb(1)
      }
    }, intervalMs)
  }

  stop(): void {
    this._running = false
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  setSpeed(intervalMs: number): void {
    if (this._running) {
      this.stop()
      this.start(intervalMs)
    }
  }

  destroy(): void {
    this.stop()
    this.callbacks = []
  }
}
