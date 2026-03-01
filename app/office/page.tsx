'use client'

import dynamic from 'next/dynamic'

const OfficeView = dynamic(
  () => import('@/components/office/OfficeView').then((m) => m.OfficeView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-screen w-screen items-center justify-center bg-[#2c2c3a]">
        <p className="font-mono text-sm text-white/60">Initializing office...</p>
      </div>
    ),
  },
)

export default function OfficePage() {
  return <OfficeView />
}
