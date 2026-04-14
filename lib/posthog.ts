// lib/posthog.ts
import posthog from 'posthog-js'

/**
 * Initialize PostHog.
 * Pass `bootstrapFlags` when an A/B experiment is active on the current page
 * so PostHog resolves the feature flag instantly (no /decide request needed).
 *
 * Example: initPostHog({ 'radar-lp-test': 'test' })
 */
export function initPostHog(bootstrapFlags: Record<string, string> = {}) {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

  // Expose instance on window for E2E tests
  ;(window as any).__posthog = posthog

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true },
    },
    ...(Object.keys(bootstrapFlags).length > 0 && {
      bootstrap: { featureFlags: bootstrapFlags },
    }),
  })
}

export function trackCtaClick(url: string, location: string) {
  posthog.capture('cta_clicked', { plan: 'radar', location })
  setTimeout(() => { window.location.href = url }, 300)
}

export { posthog }
