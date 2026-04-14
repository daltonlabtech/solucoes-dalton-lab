// lib/experiments.ts

/**
 * Central config for active A/B experiments.
 *
 * ⚠️  Set to `true` ONLY after `app/[lp]/variant-b/page.tsx` exists
 *     AND has passed Lighthouse (score ≥ variant A).
 *     Enabling without the page causes a 404 for 50% of visitors.
 *
 * Flag key convention for PostHog: `[lp]-lp-test`
 * Cookie name convention:          `ab_variant_[lp]`
 * Variant B path convention:
 *   - Hub  → app/hub-variant-b/page.tsx   (rewritten from /)
 *   - Others → app/[lp]/variant-b/page.tsx
 */
export const ACTIVE_EXPERIMENTS: Record<string, boolean> = {
  hub: false,
  radar: false,
  crm: false,
  propostas: false,
  sdr: false,
}

/** Maps URL pathname → LP key */
export const PATH_TO_LP: Record<string, string> = {
  '/': 'hub',
  '/radar': 'radar',
  '/crm': 'crm',
  '/propostas': 'propostas',
  '/sdr': 'sdr',
}

/** Maps LP key → internal rewrite destination when variant === 'test' */
export const LP_TO_VARIANT_B_PATH: Record<string, string> = {
  hub: '/hub-variant-b',
  radar: '/radar/variant-b',
  crm: '/crm/variant-b',
  propostas: '/propostas/variant-b',
  sdr: '/sdr/variant-b',
}

/** PostHog feature flag key for a given LP */
export function flagKey(lp: string): string {
  return `${lp}-lp-test`
}

/** Cookie name for a given LP */
export function cookieName(lp: string): string {
  return `ab_variant_${lp}`
}
