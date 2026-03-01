import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import type { OfficeAgent } from '../types'
import { ROLE_COLORS, ROLE_LABELS, MOOD_ICONS } from '../sprites'
import { TILE_PX } from './TileMapRenderer'

interface AgentSprite {
  container: Container
  body: Graphics
  nameTag: Text
  moodBubble: Text
  agentId: string
}

export class AgentRenderer {
  container: Container
  private sprites: Map<string, AgentSprite> = new Map()

  constructor() {
    this.container = new Container()
    this.container.label = 'agents'
  }

  syncAgents(agents: OfficeAgent[]): void {
    const currentIds = new Set(agents.map((a) => a.id))

    // Remove stale sprites
    for (const [id, sprite] of this.sprites) {
      if (!currentIds.has(id)) {
        this.container.removeChild(sprite.container)
        this.sprites.delete(id)
      }
    }

    // Add or update
    for (const agent of agents) {
      const existing = this.sprites.get(agent.id)
      if (existing) {
        this.updateSprite(existing, agent)
      } else {
        const sprite = this.createSprite(agent)
        this.sprites.set(agent.id, sprite)
        this.container.addChild(sprite.container)
      }
    }
  }

  getAgentAtScreen(worldX: number, worldY: number): string | null {
    for (const [agentId, sprite] of this.sprites) {
      const bounds = sprite.container.getBounds()
      if (
        worldX >= bounds.x &&
        worldX <= bounds.x + bounds.width &&
        worldY >= bounds.y &&
        worldY <= bounds.y + bounds.height
      ) {
        return agentId
      }
    }
    return null
  }

  highlightAgent(agentId: string | null): void {
    for (const [id, sprite] of this.sprites) {
      sprite.container.alpha = agentId === null || id === agentId ? 1 : 0.5
    }
  }

  private createSprite(agent: OfficeAgent): AgentSprite {
    const c = new Container()
    c.label = `agent-${agent.id}`
    c.eventMode = 'static'
    c.cursor = 'pointer'

    // Position on grid
    c.position.set(
      agent.gridPosition.x * TILE_PX,
      agent.gridPosition.y * TILE_PX,
    )

    // Body (colored rectangle placeholder)
    const body = new Graphics()
    const color = ROLE_COLORS[agent.role]
    body.roundRect(4, 0, TILE_PX - 8, TILE_PX * 1.5 - 4, 4)
    body.fill({ color })
    // Head circle
    body.circle(TILE_PX / 2, -6, 10)
    body.fill({ color: 0xffdbb4 })
    c.addChild(body)

    // Role label on body
    const roleStyle = new TextStyle({
      fontFamily: 'Courier New',
      fontSize: 9,
      fill: 0xffffff,
      fontWeight: 'bold',
    })
    const roleLabel = new Text({ text: ROLE_LABELS[agent.role], style: roleStyle })
    roleLabel.anchor.set(0.5)
    roleLabel.position.set(TILE_PX / 2, TILE_PX * 0.55)
    c.addChild(roleLabel)

    // Name tag below
    const nameStyle = new TextStyle({
      fontFamily: 'Courier New',
      fontSize: 8,
      fill: 0xffffff,
    })
    const nameTag = new Text({ text: agent.name, style: nameStyle })
    nameTag.anchor.set(0.5, 0)
    nameTag.position.set(TILE_PX / 2, TILE_PX * 1.5 + 2)
    c.addChild(nameTag)

    // Mood bubble
    const moodStyle = new TextStyle({
      fontFamily: 'Courier New',
      fontSize: 10,
      fill: 0xffffff,
    })
    const moodBubble = new Text({
      text: MOOD_ICONS[agent.mood],
      style: moodStyle,
    })
    moodBubble.anchor.set(0.5)
    moodBubble.position.set(TILE_PX / 2, -20)
    c.addChild(moodBubble)

    return { container: c, body, nameTag, moodBubble, agentId: agent.id }
  }

  private updateSprite(sprite: AgentSprite, agent: OfficeAgent): void {
    // Update position
    sprite.container.position.set(
      agent.gridPosition.x * TILE_PX,
      agent.gridPosition.y * TILE_PX,
    )

    // Update mood
    sprite.moodBubble.text = MOOD_ICONS[agent.mood]

    // Update name
    sprite.nameTag.text = agent.name
  }

  destroy(): void {
    this.container.removeChildren()
    this.sprites.clear()
  }
}
