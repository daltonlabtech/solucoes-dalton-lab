# A/B Testing Infrastructure — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement server-side A/B testing infrastructure that splits traffic between LP variants with no flash, no performance regression, and PostHog experiment tracking.

**Architecture:** Next.js middleware randomly assigns visitors to `control` or `test` via a session cookie, then rewrites the request to the correct page. PostHog is bootstrapped with the assigned variant at init time (no extra network request). All existing pages remain unchanged — variant B pages are added on-demand as separate routes.

**Tech Stack:** Next.js 16 middleware, `posthog-js` ^1.367, TypeScript, React 19

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `lib/experiments.ts` | CREATE | Config map — which LPs have active experiments |
| `proxy.ts` | CREATE | Edge function — assigns variant, sets cookie, rewrites to variant-b (Next.js 16: `proxy.ts` replaces `middleware.ts`) |
| `lib/posthog.ts` | MODIFY | Accept optional `bootstrap` param in `initPostHog` |
| `components/PostHogProvider.tsx` | MODIFY | Read session cookie, pass bootstrap flags to `initPostHog` |

---

## Task 1: Create `lib/experiments.ts`

**Files:**
- Create: `lib/experiments.ts`

- [ ] **Step 1: Create the file**

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/experiments.ts
git commit -m "feat(ab): add experiments config"
```

---

## Task 2: Create `middleware.ts`

**Files:**
- Create: `middleware.ts` (project root, next to `next.config.ts`)

- [ ] **Step 1: Create the file**

```ts
// middleware.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  ACTIVE_EXPERIMENTS,
  PATH_TO_LP,
  LP_TO_VARIANT_B_PATH,
  cookieName,
} from '@/lib/experiments'

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const lp = PATH_TO_LP[pathname]

  // No experiment configured for this path → pass through
  if (!lp || !ACTIVE_EXPERIMENTS[lp]) {
    return NextResponse.next()
  }

  const cookie = cookieName(lp)
  const existing = request.cookies.get(cookie)?.value as 'control' | 'test' | undefined
  const variant: 'control' | 'test' = existing ?? (Math.random() < 0.5 ? 'control' : 'test')

  // Rewrite to variant B or pass through to variant A
  const response =
    variant === 'test'
      ? NextResponse.rewrite(new URL(LP_TO_VARIANT_B_PATH[lp], request.url))
      : NextResponse.next()

  // Set session cookie (no maxAge → cleared when browser closes = "random per session")
  if (!existing) {
    response.cookies.set(cookie, variant, {
      httpOnly: false, // must be readable by PostHog bootstrap (client-side JS)
      sameSite: 'lax',
      path: '/',
    })
  }

  return response
}

export const config = {
  // Only run on LP paths — skip API routes, static files, _next
  matcher: ['/', '/radar', '/crm', '/propostas', '/sdr'],
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Manual smoke test (dev server)**

Start dev server:
```bash
npm run dev
```

Open browser DevTools → Application → Cookies → `localhost`.

1. Navigate to `http://localhost:3000/radar`
2. Verify NO `ab_variant_radar` cookie exists (experiment is `false`)
3. Verify page loads normally

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat(ab): add middleware for split assignment"
```

---

## Task 3: Update `lib/posthog.ts` — bootstrap support

**Files:**
- Modify: `lib/posthog.ts`

Current file:
```ts
// lib/posthog.ts
import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

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
  })
}

export function trackCtaClick(url: string, location: string) {
  posthog.capture('cta_clicked', { plan: 'radar', location });
  setTimeout(() => { window.location.href = url; }, 300);
}

export { posthog }
```

- [ ] **Step 1: Update `initPostHog` to accept optional bootstrap flags**

Replace the entire file:

```ts
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/posthog.ts
git commit -m "feat(ab): posthog bootstrap support for experiment variants"
```

---

## Task 4: Update `components/PostHogProvider.tsx` — read cookie and bootstrap

**Files:**
- Modify: `components/PostHogProvider.tsx`

Current file:
```tsx
// components/PostHogProvider.tsx
'use client'
import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { initPostHog, posthog } from '@/lib/posthog'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (!pathname) return
    const url = window.origin + pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return <>{children}</>
}
```

- [ ] **Step 1: Add cookie reader helper**

The helper reads `ab_variant_[lp]` from `document.cookie` and builds the PostHog bootstrap flags object. It uses `pathname` to know which LP is active.

Replace the entire file:

```tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify existing behavior unchanged (dev server)**

```bash
npm run dev
```

1. Navigate to `http://localhost:3000`
2. Open DevTools → Network → filter by `posthog` or `decide`
3. Verify PostHog still initializes (no console errors)
4. Verify pageview event fires on navigation

- [ ] **Step 4: Commit**

```bash
git add components/PostHogProvider.tsx
git commit -m "feat(ab): bootstrap PostHog with experiment variant from cookie"
```

---

## Task 5: Build and verify

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: build completes with no errors. No TypeScript errors. No missing module errors.

- [ ] **Step 2: Verify middleware is recognized**

Build output should include a line like:
```
├ ƒ / (middleware: /)
```
or mention of middleware in the build summary. If not present, check that `middleware.ts` is at project root (same level as `next.config.ts`).

- [ ] **Step 3: Manual end-to-end test with experiment enabled**

Temporarily set `radar: true` in `lib/experiments.ts`:
```ts
export const ACTIVE_EXPERIMENTS = {
  hub: false,
  radar: true,   // ← temporarily true for testing
  ...
}
```

Create a minimal variant B placeholder:
```tsx
// app/radar/variant-b/page.tsx
export default function RadarVariantB() {
  return <div style={{ color: 'white', padding: '4rem', textAlign: 'center' }}>Variant B — placeholder</div>
}
```

Start dev server:
```bash
npm run dev
```

Test sequence (use DevTools → Application → Cookies to inspect):

1. Open incognito window → navigate to `http://localhost:3000/radar`
2. Check cookie `ab_variant_radar` — value should be `control` or `test`
3. If `test`: page shows "Variant B — placeholder" ✓
4. If `control`: page shows normal Radar LP ✓
5. Refresh page → same variant as before (cookie persists within session) ✓
6. Open DevTools → Network → check PostHog events — look for `$pageview` with property `$feature/radar-lp-test` matching the cookie value ✓
7. Delete the `ab_variant_radar` cookie → refresh → new random assignment ✓

- [ ] **Step 4: Clean up test artifacts**

```ts
// lib/experiments.ts — revert
export const ACTIVE_EXPERIMENTS = {
  hub: false,
  radar: false,  // ← back to false
  ...
}
```

Delete `app/radar/variant-b/` (placeholder only).

- [ ] **Step 5: Final commit**

```bash
git add lib/experiments.ts
git rm -r app/radar/variant-b/
git commit -m "test(ab): revert test artifacts after e2e verification"
```

---

## How to Start a New Experiment (Reference)

When the team is ready to run an experiment on, say, `/radar`:

1. **Create variant B component:**
   ```
   app/radar/variant-b/page.tsx   ← full LP, mirrors structure of app/radar/page.tsx
   ```

2. **Run Lighthouse on variant B** (must score ≥ variant A):
   ```bash
   npx lighthouse http://localhost:3000/radar/variant-b --view
   ```

3. **Enable the experiment:**
   ```ts
   // lib/experiments.ts
   radar: true,
   ```

4. **Create PostHog Experiment:**
   - Go to PostHog → Experiments → New Experiment
   - Feature flag key: `radar-lp-test`
   - Variants: `control` (50%) and `test` (50%)
   - Goal metric: `cta_clicked` or `waitlist_submitted`

5. **Deploy** → experiment goes live.

6. **End the experiment:**
   - Pick winner → replace `app/radar/page.tsx` with winner content
   - Delete `app/radar/variant-b/`
   - Set `radar: false` in `experiments.ts`
   - Archive experiment in PostHog
   - Deploy
