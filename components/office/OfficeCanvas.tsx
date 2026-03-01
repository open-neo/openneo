'use client'

import { useEffect } from 'react'
import { useOfficeEngine } from '@/hooks/use-office-engine'

export function OfficeCanvas() {
  const { canvasRef, ready, init } = useOfficeEngine()

  useEffect(() => {
    init()
  }, [init])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#2c2c3a]">
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ imageRendering: 'pixelated' }}
      />
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center text-white/60">
          <span className="font-mono text-sm">Loading office...</span>
        </div>
      )}
    </div>
  )
}
