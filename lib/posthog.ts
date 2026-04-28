import posthog from 'posthog-js'

export const AB_WAITLIST_FLAG = 'ab_waitlist_popup_v1'

export function initPostHog() {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

  // Expõe instância no window para testes E2E (inofensivo em prod)
  ;(window as any).__posthog = posthog

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://app.posthog.com',
    capture_pageview: false, // vamos controlar manualmente
    capture_pageleave: true,
    autocapture: true,
    session_recording: {
      maskAllInputs: false,
      maskInputOptions: { password: true },
    },
  })
}

export function trackCtaClick(url: string, location: string, plan: string = 'radar') {
  posthog.capture('cta_clicked', { plan, location });
  setTimeout(() => { window.location.href = url; }, 300);
}

export { posthog }
