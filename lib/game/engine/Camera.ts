import { Container } from 'pixi.js'

export interface CameraBounds {
  minX: number
  maxX: number
  minY: number
  maxY: number
}

export class Camera {
  private target: Container
  private _zoom = 1
  private _x = 0
  private _y = 0
  private bounds: CameraBounds | null = null
  private isDragging = false
  private lastPointer = { x: 0, y: 0 }

  constructor(target: Container) {
    this.target = target
  }

  get x(): number { return this._x }
  get y(): number { return this._y }
  get zoom(): number { return this._zoom }

  setBounds(bounds: CameraBounds): void {
    this.bounds = bounds
  }

  setPosition(x: number, y: number): void {
    this._x = x
    this._y = y
    this.clamp()
    this.apply()
  }

  setZoom(zoom: number): void {
    this._zoom = Math.max(0.25, Math.min(3, zoom))
    this.clamp()
    this.apply()
  }

  pan(dx: number, dy: number): void {
    this._x += dx / this._zoom
    this._y += dy / this._zoom
    this.clamp()
    this.apply()
  }

  zoomAt(delta: number, pivotX: number, pivotY: number): void {
    const oldZoom = this._zoom
    const newZoom = Math.max(0.25, Math.min(3, this._zoom * (1 - delta * 0.001)))

    // Adjust position to zoom toward cursor
    const wx = (pivotX - this._x * oldZoom) / oldZoom
    const wy = (pivotY - this._y * oldZoom) / oldZoom
    this._x = (pivotX - wx * newZoom) / newZoom
    this._y = (pivotY - wy * newZoom) / newZoom

    this._zoom = newZoom
    this.clamp()
    this.apply()
  }

  // ─── Input handlers (attach to canvas) ───

  attachToCanvas(canvas: HTMLCanvasElement): () => void {
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        this.zoomAt(e.deltaY, e.offsetX, e.offsetY)
      } else {
        this.pan(-e.deltaX, -e.deltaY)
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (e.button === 1 || (e.button === 0 && e.shiftKey)) {
        this.isDragging = true
        this.lastPointer = { x: e.clientX, y: e.clientY }
        canvas.setPointerCapture(e.pointerId)
      }
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!this.isDragging) return
      const dx = e.clientX - this.lastPointer.x
      const dy = e.clientY - this.lastPointer.y
      this.lastPointer = { x: e.clientX, y: e.clientY }
      this.pan(dx, dy)
    }

    const onPointerUp = () => {
      this.isDragging = false
    }

    canvas.addEventListener('wheel', onWheel, { passive: false })
    canvas.addEventListener('pointerdown', onPointerDown)
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerup', onPointerUp)

    return () => {
      canvas.removeEventListener('wheel', onWheel)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerup', onPointerUp)
    }
  }

  // ─── Private ───

  private clamp(): void {
    if (!this.bounds) return
    this._x = Math.max(this.bounds.minX, Math.min(this.bounds.maxX, this._x))
    this._y = Math.max(this.bounds.minY, Math.min(this.bounds.maxY, this._y))
  }

  private apply(): void {
    this.target.scale.set(this._zoom)
    this.target.position.set(this._x * this._zoom, this._y * this._zoom)
  }
}
