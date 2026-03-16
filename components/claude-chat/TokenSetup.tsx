'use client'

import Link from 'next/link'
import { KeyRound, Settings } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/lib/i18n'

export function TokenSetup() {
  const { t } = useTranslation()

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <KeyRound className="size-6 text-muted-foreground" />
          </div>
          <CardTitle>{t('claude.setup.title')}</CardTitle>
          <CardDescription>{t('claude.setup.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link href="/dashboard/claude/settings">
              <Settings className="mr-2 size-4" />
              {t('claude.setup.goToSettings')}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
