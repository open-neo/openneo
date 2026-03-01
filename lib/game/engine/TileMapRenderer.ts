import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import type { Room, FurnitureItem } from '../types'
import { ROOM_FLOOR_COLORS, WALL_COLOR, FURNITURE_COLORS, GRID_LINE_COLOR, GRID_LINE_ALPHA } from '../sprites'

const TILE_SIZE = 16
const SCALE = 3

export const TILE_PX = TILE_SIZE * SCALE // 48px per tile on screen

export class TileMapRenderer {
  container: Container
  private roomContainers: Map<string, Container> = new Map()

  constructor() {
    this.container = new Container()
    this.container.label = 'tilemap'
  }

  renderRooms(rooms: Room[]): void {
    // Clear existing
    this.container.removeChildren()
    this.roomContainers.clear()

    for (const room of rooms) {
      const rc = this.renderRoom(room)
      this.roomContainers.set(room.id, rc)
      this.container.addChild(rc)
    }
  }

  private renderRoom(room: Room): Container {
    const rc = new Container()
    rc.label = `room-${room.id}`
    const { x, y, width, height } = room.gridBounds
    rc.position.set(x * TILE_PX, y * TILE_PX)

    // Floor
    const floor = new Graphics()
    const floorColor = room.unlocked
      ? (ROOM_FLOOR_COLORS[room.id] ?? 0xcccccc)
      : 0x444444
    floor.rect(0, 0, width * TILE_PX, height * TILE_PX)
    floor.fill({ color: floorColor })
    rc.addChild(floor)

    // Grid lines
    const gridLines = new Graphics()
    for (let gx = 0; gx <= width; gx++) {
      gridLines.moveTo(gx * TILE_PX, 0)
      gridLines.lineTo(gx * TILE_PX, height * TILE_PX)
    }
    for (let gy = 0; gy <= height; gy++) {
      gridLines.moveTo(0, gy * TILE_PX)
      gridLines.lineTo(width * TILE_PX, gy * TILE_PX)
    }
    gridLines.stroke({ color: GRID_LINE_COLOR, alpha: GRID_LINE_ALPHA, width: 1 })
    rc.addChild(gridLines)

    // Walls (top and left borders)
    const walls = new Graphics()
    walls.rect(0, 0, width * TILE_PX, 4)
    walls.fill({ color: WALL_COLOR })
    walls.rect(0, 0, 4, height * TILE_PX)
    walls.fill({ color: WALL_COLOR })
    walls.rect(0, (height * TILE_PX) - 4, width * TILE_PX, 4)
    walls.fill({ color: WALL_COLOR })
    walls.rect((width * TILE_PX) - 4, 0, 4, height * TILE_PX)
    walls.fill({ color: WALL_COLOR })
    rc.addChild(walls)

    // Room label
    const labelStyle = new TextStyle({
      fontFamily: 'Courier New',
      fontSize: 11,
      fill: room.unlocked ? 0x555555 : 0x888888,
    })
    const label = new Text({ text: room.name, style: labelStyle })
    label.position.set(8, 8)
    rc.addChild(label)

    // Locked overlay
    if (!room.unlocked) {
      const lockOverlay = new Graphics()
      lockOverlay.rect(0, 0, width * TILE_PX, height * TILE_PX)
      lockOverlay.fill({ color: 0x000000, alpha: 0.5 })
      rc.addChild(lockOverlay)

      const lockStyle = new TextStyle({
        fontFamily: 'Courier New',
        fontSize: 14,
        fill: 0xffffff,
      })
      const lockText = new Text({
        text: `🔒 $${room.unlockCost.toLocaleString()}`,
        style: lockStyle,
      })
      lockText.anchor.set(0.5)
      lockText.position.set((width * TILE_PX) / 2, (height * TILE_PX) / 2)
      rc.addChild(lockText)
    }

    // Furniture (only for unlocked rooms)
    if (room.unlocked) {
      for (const item of room.furniture) {
        const f = this.renderFurniture(item, x, y)
        rc.addChild(f)
      }
    }

    return rc
  }

  private renderFurniture(item: FurnitureItem, roomX: number, roomY: number): Graphics {
    const color = FURNITURE_COLORS[item.type] ?? 0x888888
    const localX = (item.gridPosition.x - roomX) * TILE_PX
    const localY = (item.gridPosition.y - roomY) * TILE_PX

    const g = new Graphics()
    g.roundRect(
      localX + 4,
      localY + 4,
      item.gridSize.width * TILE_PX - 8,
      item.gridSize.height * TILE_PX - 8,
      4,
    )
    g.fill({ color })
    return g
  }

  updateRoom(room: Room): void {
    const existing = this.roomContainers.get(room.id)
    if (existing) {
      const idx = this.container.getChildIndex(existing)
      this.container.removeChild(existing)
      const newRc = this.renderRoom(room)
      this.roomContainers.set(room.id, newRc)
      this.container.addChildAt(newRc, idx)
    }
  }
}
