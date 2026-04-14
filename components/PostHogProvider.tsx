// components/PostHogProvider.tsx
'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'
import { PATH_TO_LP, ACTIVE_EXPERIMENTS, flagKey, cookieName } from '@/lib/experiments'

/** Reads the A/B variant cookie for the current LP and returns PostHog bootstrap flags. */
function getBootstrapFlags(pathname: string): Record<string, string> {
  const lp = PATH_TO_LP[pathname]
  if (!lp || !ACTIVE_EXPERIMENTS[lp]) return {}

  const name = cookieName(lp)
  const variant = document.cookie
    .split('; ')
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')[1]

  if (!variant) return {}
  return { [flagKey(lp)]: variant }
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initPostHog(getBootstrapFlags(pathname ?? '/'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!pathname) return
    const url = window.origin + pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return <>{children}</>
}
