import { Container, Graphics, Text, TextStyle } from 'pixi.js'
import type { FurnitureItem } from '../types'
import { FURNITURE_COLORS } from '../sprites'
import { TILE_PX } from './TileMapRenderer'

export class FurnitureRenderer {
  container: Container

  constructor() {
    this.container = new Container()
    this.container.label = 'furniture'
  }

  renderFurniture(items: FurnitureItem[]): void {
    this.container.removeChildren()

    for (const item of items) {
      const sprite = this.createFurnitureSprite(item)
      this.container.addChild(sprite)
    }
  }

  private createFurnitureSprite(item: FurnitureItem): Container {
    const c = new Container()
    c.label = `furniture-${item.id}`
    c.position.set(
      item.gridPosition.x * TILE_PX,
      item.gridPosition.y * TILE_PX,
    )

    const color = FURNITURE_COLORS[item.type] ?? 0x888888
    const g = new Graphics()
    g.roundRect(
      2,
      2,
      item.gridSize.width * TILE_PX - 4,
      item.gridSize.height * TILE_PX - 4,
      3,
    )
    g.fill({ color })
    c.addChild(g)

    // Label
    const style = new TextStyle({
      fontFamily: 'Courier New',
      fontSize: 7,
      fill: item.type === 'whiteboard' ? 0x333333 : 0xffffff,
    })
    const label = new Text({ text: item.type, style })
    label.anchor.set(0.5)
    label.position.set(
      (item.gridSize.width * TILE_PX) / 2,
      (item.gridSize.height * TILE_PX) / 2,
    )
    c.addChild(label)

    return c
  }
}
