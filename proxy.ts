// proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  ACTIVE_EXPERIMENTS,
  PATH_TO_LP,
  LP_TO_VARIANT_B_PATH,
  cookieName,
  type Variant,
} from '@/lib/experiments'

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl
  const lp = PATH_TO_LP[pathname]

  // No experiment configured for this path → pass through
  if (!lp || !ACTIVE_EXPERIMENTS[lp]) {
    return NextResponse.next()
  }

  const cookie = cookieName(lp)
  const raw = request.cookies.get(cookie)?.value
  const existing: Variant | undefined =
    raw === 'control' || raw === 'test' ? raw : undefined
  const variant: Variant = existing ?? (Math.random() < 0.5 ? 'control' : 'test')

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
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return response
}

export const config = {
  // Must be a static array — Next.js/Turbopack requires static matcher values
  matcher: ['/', '/radar', '/crm', '/propostas', '/sdr'],
}
