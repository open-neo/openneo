'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/lib/i18n'
import { Gamepad2, Monitor } from 'lucide-react'

export function ModeToggle() {
  const router = useRouter()
  const pathname = usePathname()
  const { t } = useLocale()

  const isOffice = pathname?.startsWith('/office')

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1.5 text-xs"
      onClick={() => {
        const target = isOffice ? '/dashboard/' : '/office/'
        if (typeof window !== 'undefined' && (window as any).electronAPI) {
          window.location.href = target
        } else {
          router.push(target)
        }
      }}
    >
      {isOffice ? (
        <>
          <Monitor className="size-3.5" />
          {t('office.proMode')}
        </>
      ) : (
        <>
          <Gamepad2 className="size-3.5" />
          {t('office.officeMode')}
        </>
      )}
    </Button>
  )
}
