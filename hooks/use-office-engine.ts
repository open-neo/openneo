'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { PixiApp } from '@/lib/game/engine/PixiApp'
import { TileMapRenderer } from '@/lib/game/engine/TileMapRenderer'
import { AgentRenderer } from '@/lib/game/engine/AgentRenderer'
import { Camera } from '@/lib/game/engine/Camera'
import { InteractionManager, type InteractionCallback } from '@/lib/game/engine/InteractionManager'
import { useGameStore } from '@/lib/game/store'

export function useOfficeEngine() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pixiAppRef = useRef<PixiApp | null>(null)
  const tileMapRef = useRef<TileMapRenderer | null>(null)
  const agentRendererRef = useRef<AgentRenderer | null>(null)
  const cameraRef = useRef<Camera | null>(null)
  const interactionRef = useRef<InteractionManager | null>(null)
  const cleanupRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  const rooms = useGameStore((s) => s.rooms)
  const agents = useGameStore((s) => s.agents)
  const selectAgent = useGameStore((s) => s.selectAgent)

  const onInteraction: InteractionCallback = useCallback((type, data) => {
    if (type === 'agent_click' && data.agentId) {
      selectAgent(data.agentId)
    }
  }, [selectAgent])

  const init = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas || pixiAppRef.current?.ready) return

    const pixiApp = new PixiApp()
    pixiAppRef.current = pixiApp

    const rect = canvas.parentElement?.getBoundingClientRect()
    const width = rect?.width ?? 800
    const height = rect?.height ?? 600

    await pixiApp.init({
      canvas,
      width,
      height,
      backgroundColor: 0x1a1a2e,
    })

    // TileMap
    const tileMap = new TileMapRenderer()
    tileMapRef.current = tileMap
    tileMap.renderRooms(rooms)
    pixiApp.world.addChild(tileMap.container)

    // Agent renderer
    const agentRenderer = new AgentRenderer()
    agentRendererRef.current = agentRenderer
    agentRenderer.syncAgents(agents)
    pixiApp.world.addChild(agentRenderer.container)

    // Camera
    const camera = new Camera(pixiApp.world)
    cameraRef.current = camera
    const cameraCleanup = camera.attachToCanvas(canvas)

    // Interaction manager
    const interaction = new InteractionManager(
      agentRenderer,
      camera,
      pixiApp.world,
      onInteraction,
    )
    interactionRef.current = interaction
    interaction.attach(canvas)

    // Resize handler
    const onResize = () => {
      const newRect = canvas.parentElement?.getBoundingClientRect()
      if (newRect) {
        pixiApp.resize(newRect.width, newRect.height)
      }
    }
    window.addEventListener('resize', onResize)

    cleanupRef.current = () => {
      cameraCleanup()
      interaction.detach()
      window.removeEventListener('resize', onResize)
    }

    setReady(true)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync rooms when they change
  useEffect(() => {
    if (ready && tileMapRef.current) {
      tileMapRef.current.renderRooms(rooms)
    }
  }, [rooms, ready])

  // Sync agents when they change
  useEffect(() => {
    if (ready && agentRendererRef.current) {
      agentRendererRef.current.syncAgents(agents)
    }
  }, [agents, ready])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupRef.current?.()
      pixiAppRef.current?.destroy()
      pixiAppRef.current = null
      setReady(false)
    }
  }, [])

  return { canvasRef, pixiApp: pixiAppRef, ready, init }
}
