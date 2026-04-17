// components/PostHogProvider.tsx
'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'

const PRODUCT_BY_PATH: Record<string, string> = {
  '/':          'home',
  '/sdr':       'sdr',
  '/crm':       'crm',
  '/propostas': 'propostas',
  '/radar':     'radar',
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (!pathname) return
    const url = window.origin + pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    const product = PRODUCT_BY_PATH[pathname] ?? null
    posthog.capture('$pageview', {
      $current_url: url,
      ...(product ? { product } : {}),
    })
  }, [pathname, searchParams])

  return <>{children}</>
}
