// proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import {
  ACTIVE_EXPERIMENTS,
  PATH_TO_LP,
  LP_TO_VARIANT_B_PATH,
  cookieName,
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
  const existing: 'control' | 'test' | undefined =
    raw === 'control' || raw === 'test' ? raw : undefined
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
      secure: process.env.NODE_ENV === 'production',
    })
  }

  return response
}

export const config = {
  // Only run on LP paths — skip API routes, static files, _next
  matcher: ['/', '/radar', '/crm', '/propostas', '/sdr'],
}
