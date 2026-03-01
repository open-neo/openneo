import { Application, Container } from 'pixi.js'

export interface PixiAppOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
  backgroundColor?: number
  resolution?: number
}

export class PixiApp {
  app: Application
  world: Container
  private _ready = false

  constructor() {
    this.app = new Application()
    this.world = new Container()
    this.world.label = 'world'
  }

  async init(options: PixiAppOptions): Promise<void> {
    await this.app.init({
      canvas: options.canvas,
      width: options.width,
      height: options.height,
      backgroundColor: options.backgroundColor ?? 0x2c2c3a,
      resolution: options.resolution ?? window.devicePixelRatio,
      autoDensity: true,
      antialias: false,
    })

    this.app.stage.addChild(this.world)
    this._ready = true
  }

  get ready(): boolean {
    return this._ready
  }

  resize(width: number, height: number): void {
    if (!this._ready) return
    this.app.renderer.resize(width, height)
  }

  destroy(): void {
    this._ready = false
    this.app.destroy(true, { children: true, texture: true })
  }
}
