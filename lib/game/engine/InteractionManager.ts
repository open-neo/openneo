import type { Container } from 'pixi.js'
import type { AgentRenderer } from './AgentRenderer'
import type { Camera } from './Camera'
import { TILE_PX } from './TileMapRenderer'

export type InteractionCallback = (type: 'agent_click' | 'tile_click', data: { agentId?: string; tileX?: number; tileY?: number }) => void

export class InteractionManager {
  private canvas: HTMLCanvasElement | null = null
  private agentRenderer: AgentRenderer
  private camera: Camera
  private world: Container
  private callback: InteractionCallback
  private cleanup: (() => void) | null = null

  constructor(
    agentRenderer: AgentRenderer,
    camera: Camera,
    world: Container,
    callback: InteractionCallback,
  ) {
    this.agentRenderer = agentRenderer
    this.camera = camera
    this.world = world
    this.callback = callback
  }

  attach(canvas: HTMLCanvasElement): void {
    this.canvas = canvas

    const onClick = (e: PointerEvent) => {
      // Ignore drags
      if (e.shiftKey) return

      const rect = canvas.getBoundingClientRect()
      const canvasX = e.clientX - rect.left
      const canvasY = e.clientY - rect.top

      // Convert screen coords to world coords
      const worldX = (canvasX / this.camera.zoom) - this.camera.x
      const worldY = (canvasY / this.camera.zoom) - this.camera.y

      // Check if clicking on an agent
      const agentId = this.agentRenderer.getAgentAtScreen(worldX, worldY)
      if (agentId) {
        this.callback('agent_click', { agentId })
        return
      }

      // Otherwise, report tile click
      const tileX = Math.floor(worldX / TILE_PX)
      const tileY = Math.floor(worldY / TILE_PX)
      this.callback('tile_click', { tileX, tileY })
    }

    canvas.addEventListener('pointerup', onClick)
    this.cleanup = () => {
      canvas.removeEventListener('pointerup', onClick)
    }
  }

  detach(): void {
    this.cleanup?.()
    this.cleanup = null
    this.canvas = null
  }
}
