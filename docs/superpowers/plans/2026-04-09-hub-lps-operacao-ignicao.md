# Hub + LPs Operação Ignição — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `soluções.daltonlab.ai` — hub page + 3 landing pages de validação de demanda (SDR WhatsApp, Gerador de Propostas, Transcrição+CRM) + LP do Radar, com formulário de waitlist, PostHog analytics, e deploy no Railway.

**Architecture:** Next.js 14 App Router com Tailwind CSS. Design system Dalton Lab (dark theme, #0a1628, cyan #33ADE5, purple #A855F7). Componentes de seção reutilizáveis entre LPs. Formulário de waitlist via API route `/api/waitlist` configurável por env var.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Lucide React, PostHog JS, Plus Jakarta Sans (Google Fonts), Railway deploy.

**Specs de referência (copy completo):**
- `/Users/deoliveiradiego/Projects/Brain/Dalton Lab/Épicos/Spec — Hub soluções.daltonlab.ai.md`
- `/Users/deoliveiradiego/Projects/Brain/Dalton Lab/Épicos/Spec — SDR WhatsApp.md`
- `/Users/deoliveiradiego/Projects/Brain/Dalton Lab/Épicos/Spec — Gerador de Propostas.md`
- `/Users/deoliveiradiego/Projects/Brain/Dalton Lab/Épicos/Spec — Transcrição + CRM.md`

---

## File Map

| File | Responsabilidade |
|------|-----------------|
| `app/layout.tsx` | Root layout: fontes, PostHog provider, metadados globais |
| `app/page.tsx` | Hub `/` — lista todos os produtos |
| `app/sdr/page.tsx` | LP SDR WhatsApp |
| `app/propostas/page.tsx` | LP Gerador de Propostas |
| `app/crm/page.tsx` | LP Transcrição + CRM |
| `app/radar/page.tsx` | LP Radar (por último) |
| `app/api/waitlist/route.ts` | POST handler — salva lead no database |
| `components/ui/Button.tsx` | Botão primário/secundário/ghost |
| `components/ui/Badge.tsx` | Tag/label com borda cyan |
| `components/layout/Navbar.tsx` | Logo + nav links |
| `components/layout/Footer.tsx` | Rodapé simples |
| `components/WaitlistModal.tsx` | Modal com form de waitlist (Nome, WhatsApp, Empresa, pergunta de preço) |
| `components/sections/HeroLP.tsx` | Hero de LP: headline + subheadline + CTA + selo |
| `components/sections/PainSection.tsx` | Seção de dor com dados |
| `components/sections/SolutionSection.tsx` | 3 passos da solução |
| `components/sections/SocialProof.tsx` | Placeholder de prova social |
| `components/sections/PricingWaitlist.tsx` | Tabela de preço + form embutido |
| `components/sections/FAQSection.tsx` | Accordion FAQ |
| `components/PostHogProvider.tsx` | PostHog client-side provider |
| `lib/posthog.ts` | Configuração PostHog + helpers |
| `styles/globals.css` | Tokens CSS do design system Dalton Lab |
| `tailwind.config.ts` | Extensão do tema com tokens Dalton Lab |
| `.env.local.example` | Template de variáveis de ambiente |
| `next.config.ts` | Config Next.js |
| `railway.toml` | Config deploy Railway |

---

## Task 1: Setup Next.js + Design System Base

**Files:**
- Create: `tailwind.config.ts`
- Create: `styles/globals.css`
- Create: `.env.local.example`
- Create: `next.config.ts`
- Create: `railway.toml`

- [ ] **Step 1: Inicializar projeto Next.js**

```bash
cd /Users/deoliveiradiego/Projects/solucoes-dalton-lab
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --no-turbopack
```

Responder:
- Use src/ directory? → No
- Customize import alias? → No (usa @/*)

- [ ] **Step 2: Instalar dependências**

```bash
npm install lucide-react posthog-js posthog-node
npm install -D @types/node
```

- [ ] **Step 3: Configurar tailwind.config.ts com tokens Dalton Lab**

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dalton: {
          bg: '#0a1628',
          'bg-card': 'rgba(255,255,255,0.03)',
          cyan: '#33ADE5',
          purple: '#A855F7',
          magenta: '#EC4899',
          white: '#ffffff',
          'gray-light': '#94a3b8',
          'gray-mid': '#64748b',
          'gray-dark': '#334155',
          'text-body': '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-cyan-purple': 'linear-gradient(90deg, #33ADE5, #A855F7)',
        'gradient-glow': 'radial-gradient(circle, rgba(51,173,229,0.15) 0%, transparent 70%)',
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Configurar globals.css com tokens e fonte**

```css
/* styles/globals.css */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg: #0a1628;
  --cyan: #33ADE5;
  --purple: #A855F7;
  --magenta: #EC4899;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--bg);
  color: #e2e8f0;
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
}

/* Gradient text utility */
.gradient-text {
  background: linear-gradient(90deg, #33ADE5, #A855F7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glass card */
.glass-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
}

/* Highlight box (dor/citação) */
.highlight-box {
  border-left: 4px solid #33ADE5;
  padding-left: 20px;
  background: linear-gradient(90deg, rgba(51, 173, 229, 0.08), transparent);
}

/* Divider decorativo */
.divider-glow {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(51, 173, 229, 0.3), transparent);
  width: 100%;
}

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: #0a1628; }
::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
```

- [ ] **Step 5: Criar .env.local.example**

```bash
# .env.local.example
# PostHog
NEXT_PUBLIC_POSTHOG_KEY=phc_XXXXXXXXXX
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

# Waitlist API (database)
WAITLIST_API_URL=https://seu-backend/api/leads
WAITLIST_API_KEY=sua-chave-secreta

# App URL
NEXT_PUBLIC_APP_URL=https://solucoes.daltonlab.ai
```

- [ ] **Step 6: Configurar next.config.ts**

```typescript
// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'instagram-data-production.up.railway.app' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 7: Criar railway.toml**

```toml
# railway.toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "npm start"
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3

[[services]]
name = "solucoes-dalton-lab"
```

- [ ] **Step 8: Verificar que o app sobe**

```bash
cp .env.local.example .env.local
npm run dev
```

Esperado: app rodando em http://localhost:3000 com a página default do Next.js.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: setup Next.js + Dalton Lab design system tokens"
```

---

## Task 2: Componentes Base (UI + Layout)

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/layout/Navbar.tsx`
- Create: `components/layout/Footer.tsx`
- Create: `public/logo.svg` (placeholder — substituir pelo logo real)

- [ ] **Step 1: Criar Button.tsx**

```tsx
// components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-dalton-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-dalton-bg disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-dalton-cyan text-dalton-bg hover:brightness-110 active:scale-[0.98]',
      secondary: 'border border-dalton-cyan/40 text-dalton-cyan hover:bg-dalton-cyan/10 active:scale-[0.98]',
      ghost: 'text-dalton-gray-light hover:text-white hover:bg-white/5',
    }

    const sizes = {
      sm: 'px-5 py-2.5 text-sm',
      md: 'px-7 py-3.5 text-base',
      lg: 'px-9 py-4 text-lg',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Enviando...
          </span>
        ) : children}
      </button>
    )
  }
)
Button.displayName = 'Button'
```

- [ ] **Step 2: Criar lib/utils.ts (cn helper)**

```typescript
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

```bash
npm install clsx tailwind-merge
```

- [ ] **Step 3: Criar Badge.tsx**

```tsx
// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-block text-xs font-bold uppercase tracking-[0.2em] text-dalton-cyan',
      'border border-dalton-cyan/30 px-5 py-2 rounded-full bg-dalton-cyan/5',
      className
    )}>
      {children}
    </span>
  )
}
```

- [ ] **Step 4: Criar Navbar.tsx**

```tsx
// components/layout/Navbar.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const links = [
  { href: '/sdr', label: 'SDR WhatsApp' },
  { href: '/propostas', label: 'Gerador de Propostas' },
  { href: '/crm', label: 'Transcrição + CRM' },
  { href: '/radar', label: 'Radar' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dalton-bg/80 backdrop-blur-lg">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" role="navigation" aria-label="Navegação principal">
        <Link href="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-dalton-cyan rounded">
          <span className="text-xl font-black text-white tracking-tight">
            Dalton <span className="gradient-text">Lab</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-dalton-gray-light hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:text-dalton-cyan">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" className="hidden md:block">
          <Button size="sm">Ver soluções</Button>
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-dalton-gray-light hover:text-white p-2 rounded focus-visible:ring-2 focus-visible:ring-dalton-cyan"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-dalton-bg px-6 py-4">
          <ul className="flex flex-col gap-4">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-dalton-gray-light hover:text-white transition-colors block py-1"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
```

- [ ] **Step 5: Criar Footer.tsx**

```tsx
// components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xl font-black text-white">
          Dalton <span className="gradient-text">Lab</span>
        </span>
        <p className="text-dalton-gray-mid text-sm">
          © {new Date().getFullYear()} Dalton Lab. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-sm text-dalton-gray-mid">
          <Link href="/" className="hover:text-dalton-cyan transition-colors">Soluções</Link>
          <a href="mailto:contato@daltonlab.ai" className="hover:text-dalton-cyan transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 6: Atualizar app/layout.tsx com Navbar, Footer e fontes**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Dalton Lab — Ferramentas de IA para PME',
    template: '%s | Dalton Lab',
  },
  description: 'Ferramentas prontas para usar que resolvem o que toma mais tempo na sua empresa.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://solucoes.daltonlab.ai'),
  openGraph: {
    siteName: 'Dalton Lab',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-dalton-bg text-dalton-text-body">
        <Navbar />
        <main id="main-content" className="pt-16">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Verificar visual básico**

```bash
npm run dev
```

Acessar http://localhost:3000 — deve mostrar navbar dark, fundo #0a1628, footer. Verificar no mobile (375px).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: base components (Button, Badge, Navbar, Footer) + layout"
```

---

## Task 3: PostHog Analytics

**Files:**
- Create: `lib/posthog.ts`
- Create: `components/PostHogProvider.tsx`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Criar lib/posthog.ts**

```typescript
// lib/posthog.ts
import posthog from 'posthog-js'

export function initPostHog() {
  if (typeof window === 'undefined') return
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return

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

export { posthog }
```

- [ ] **Step 2: Criar PostHogProvider.tsx**

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

- [ ] **Step 3: Adicionar PostHogProvider ao layout**

Modificar `app/layout.tsx` — adicionar `<Suspense>` wrapping (necessário por useSearchParams):

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PostHogProvider } from '@/components/PostHogProvider'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Dalton Lab — Ferramentas de IA para PME',
    template: '%s | Dalton Lab',
  },
  description: 'Ferramentas prontas para usar que resolvem o que toma mais tempo na sua empresa.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://solucoes.daltonlab.ai'),
  openGraph: { siteName: 'Dalton Lab', type: 'website' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-dalton-bg text-dalton-text-body">
        <Suspense fallback={null}>
          <PostHogProvider>
            <Navbar />
            <main id="main-content" className="pt-16">
              {children}
            </main>
            <Footer />
          </PostHogProvider>
        </Suspense>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Verificar no browser**

```bash
npm run dev
```

Abrir http://localhost:3000 e checar no Network tab que existe uma request para `app.posthog.com/decide` (só se `NEXT_PUBLIC_POSTHOG_KEY` estiver preenchido no `.env.local`). Se a key não estiver configurada ainda, o provider não dispara — ok.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: PostHog analytics provider com pageview tracking"
```

---

## Task 4: API Route de Waitlist

**Files:**
- Create: `app/api/waitlist/route.ts`

- [ ] **Step 1: Criar route.ts**

```typescript
// app/api/waitlist/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface WaitlistPayload {
  nome: string
  whatsapp: string
  empresa: string
  price_answer: 'sim' | 'conversa' | 'nao'
  product: string
}

export async function POST(req: NextRequest) {
  let body: WaitlistPayload

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { nome, whatsapp, empresa, price_answer, product } = body

  if (!nome || !whatsapp || !empresa || !product) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 422 })
  }

  const apiUrl = process.env.WAITLIST_API_URL
  const apiKey = process.env.WAITLIST_API_KEY

  if (!apiUrl) {
    // Em dev sem configuração, simula sucesso
    console.log('[waitlist] Lead recebido (sem DB configurado):', { nome, whatsapp, empresa, price_answer, product })
    return NextResponse.json({ ok: true, message: 'Lead registrado (modo dev)' })
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(apiKey ? { 'Authorization': `Bearer ${apiKey}` } : {}),
    },
    body: JSON.stringify({
      nome,
      whatsapp,
      empresa,
      price_answer,
      product,
      created_at: new Date().toISOString(),
      source: 'solucoes.daltonlab.ai',
    }),
  })

  if (!res.ok) {
    console.error('[waitlist] Erro ao salvar lead:', res.status, await res.text())
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
```

- [ ] **Step 2: Testar endpoint manualmente**

```bash
# Em outro terminal com o app rodando:
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","whatsapp":"11999999999","empresa":"Empresa Teste","price_answer":"sim","product":"sdr"}'
```

Esperado: `{"ok":true,"message":"Lead registrado (modo dev)"}`

- [ ] **Step 3: Testar campo obrigatório faltando**

```bash
curl -X POST http://localhost:3000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste"}'
```

Esperado: status 422, `{"error":"Missing required fields"}`

- [ ] **Step 4: Commit**

```bash
git add app/api/waitlist/route.ts
git commit -m "feat: waitlist API route com fallback dev mode"
```

---

## Task 5: WaitlistModal (componente compartilhado)

**Files:**
- Create: `components/WaitlistModal.tsx`

- [ ] **Step 1: Criar WaitlistModal.tsx**

```tsx
// components/WaitlistModal.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { posthog } from '@/lib/posthog'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  product: string
  productLabel: string
  price?: string
}

type PriceAnswer = 'sim' | 'conversa' | 'nao' | ''

export function WaitlistModal({ isOpen, onClose, product, productLabel, price = 'R$ 297/mês' }: WaitlistModalProps) {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [priceAnswer, setPriceAnswer] = useState<PriceAnswer>('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  // Foco no primeiro campo ao abrir
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Fechar com ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!priceAnswer) { setError('Responda a pergunta sobre o preço.'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, whatsapp, empresa, price_answer: priceAnswer, product }),
      })

      if (!res.ok) throw new Error('Erro ao enviar')

      posthog.capture('waitlist_signup', { product, price_answer: priceAnswer })
      setSuccess(true)
    } catch {
      setError('Algo deu errado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-8 shadow-2xl border border-dalton-cyan/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dalton-gray-mid hover:text-white transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-dalton-cyan"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-white mb-3">Tudo certo!</h2>
            <p className="text-dalton-gray-light">
              Você está na lista. A gente entra em contato quando o <strong className="text-white">{productLabel}</strong> for lançado.
            </p>
            <button onClick={onClose} className="mt-6 text-dalton-cyan text-sm underline">Fechar</button>
          </div>
        ) : (
          <>
            <h2 id="modal-title" className="text-xl font-bold text-white mb-1">
              Garantir meu lugar
            </h2>
            <p className="text-dalton-gray-light text-sm mb-6">
              {productLabel} · {price} · Cancele quando quiser
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor="nome" className="text-sm text-dalton-gray-light mb-1 block">
                  Nome <span aria-hidden="true" className="text-dalton-magenta">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="nome"
                  type="text"
                  required
                  autoComplete="name"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-dalton-gray-mid focus:outline-none focus:border-dalton-cyan/50 transition-colors"
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="text-sm text-dalton-gray-light mb-1 block">
                  WhatsApp <span aria-hidden="true" className="text-dalton-magenta">*</span>
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-dalton-gray-mid focus:outline-none focus:border-dalton-cyan/50 transition-colors"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label htmlFor="empresa" className="text-sm text-dalton-gray-light mb-1 block">
                  Empresa <span aria-hidden="true" className="text-dalton-magenta">*</span>
                </label>
                <input
                  id="empresa"
                  type="text"
                  required
                  autoComplete="organization"
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-dalton-gray-mid focus:outline-none focus:border-dalton-cyan/50 transition-colors"
                  placeholder="Nome da sua empresa"
                />
              </div>

              {/* Pergunta de preço */}
              <div>
                <p className="text-sm text-dalton-gray-light mb-2">
                  Esse preço faz sentido para o seu negócio agora?
                </p>
                <div className="flex flex-col gap-2" role="radiogroup" aria-required="true">
                  {[
                    { value: 'sim', label: 'Sim, faz sentido' },
                    { value: 'conversa', label: 'Precisa de conversa' },
                    { value: 'nao', label: 'Ainda não' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${priceAnswer === opt.value ? 'border-dalton-cyan/50 bg-dalton-cyan/10 text-white' : 'border-white/10 text-dalton-gray-light hover:border-white/20'}`}>
                      <input
                        type="radio"
                        name="price_answer"
                        value={opt.value}
                        checked={priceAnswer === opt.value}
                        onChange={() => setPriceAnswer(opt.value as PriceAnswer)}
                        className="sr-only"
                      />
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${priceAnswer === opt.value ? 'border-dalton-cyan' : 'border-white/30'}`}>
                        {priceAnswer === opt.value && <span className="w-2 h-2 rounded-full bg-dalton-cyan" />}
                      </span>
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <p role="alert" className="text-dalton-magenta text-sm">{error}</p>
              )}

              <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
                Garantir meu lugar →
              </Button>

              <p className="text-xs text-dalton-gray-mid text-center">
                Sem spam. A gente só avisa no lançamento.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Testar modal manualmente**

Criar uma página temporária de teste `app/test-modal/page.tsx` para verificar abertura, fechamento (ESC, click fora, botão X), submit (sem DB → modo dev), estados de loading e sucesso. Deletar a página após verificar.

- [ ] **Step 3: Commit**

```bash
git add components/WaitlistModal.tsx
git commit -m "feat: WaitlistModal com form de 4 campos + radio de preço + PostHog"
```

---

## Task 6: Seções Compartilhadas de LP

**Files:**
- Create: `components/sections/HeroLP.tsx`
- Create: `components/sections/PainSection.tsx`
- Create: `components/sections/SolutionSection.tsx`
- Create: `components/sections/SocialProofPlaceholder.tsx`
- Create: `components/sections/PricingWaitlist.tsx`
- Create: `components/sections/FAQSection.tsx`

- [ ] **Step 1: Criar HeroLP.tsx**

```tsx
// components/sections/HeroLP.tsx
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface HeroLPProps {
  badge: string
  headline: string
  subheadline: string
  price?: string
  onCTA: () => void
}

export function HeroLP({ badge, headline, subheadline, price = 'R$ 297/mês · Sem setup · Cancele quando quiser', onCTA }: HeroLPProps) {
  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
      {/* Glow de fundo */}
      <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
        <Badge>{badge}</Badge>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
          {headline}
        </h1>

        <p className="text-lg md:text-xl text-dalton-gray-light max-w-2xl leading-relaxed">
          {subheadline}
        </p>

        <Button size="lg" onClick={onCTA} className="mt-2">
          Garantir meu lugar →
        </Button>

        <p className="text-sm text-dalton-gray-mid">{price}</p>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Criar PainSection.tsx**

```tsx
// components/sections/PainSection.tsx
interface Stat {
  value: string
  label: string
}

interface PainSectionProps {
  title: string
  body: string[]
  stats: Stat[]
}

export function PainSection({ title, body, stats }: PainSectionProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="divider-glow mb-16" />

        <h2 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">
          {title}
        </h2>

        <div className="highlight-box mb-12">
          {body.map((para, i) => (
            <p key={i} className="text-dalton-text-body text-lg leading-relaxed mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center border-t-2 border-dalton-cyan/30">
              <p className="text-2xl font-black gradient-text mb-2">{stat.value}</p>
              <p className="text-dalton-gray-light text-sm leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Criar SolutionSection.tsx**

```tsx
// components/sections/SolutionSection.tsx
interface Step {
  number: string
  title: string
  description: string
}

interface SolutionSectionProps {
  title: string
  steps: Step[]
  closing?: string
}

export function SolutionSection({ title, steps, closing }: SolutionSectionProps) {
  return (
    <section className="py-20 px-6 bg-white/[0.01]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-12 leading-tight">
          {title}
        </h2>

        <div className="flex flex-col gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-dalton-cyan/10 border border-dalton-cyan/30 flex items-center justify-center">
                <span className="gradient-text font-black text-lg">{step.number}</span>
              </div>
              <div className="glass-card flex-1 p-6">
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-dalton-gray-light leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {closing && (
          <div className="mt-10 highlight-box">
            <p className="text-dalton-text-body text-lg italic leading-relaxed">{closing}</p>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Criar SocialProofPlaceholder.tsx**

```tsx
// components/sections/SocialProofPlaceholder.tsx
// Placeholder — substituir por caso âncora real antes de publicar
export function SocialProofPlaceholder() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="divider-glow mb-16" />
        <div className="glass-card p-10 text-center border border-dalton-cyan/10">
          <p className="text-dalton-gray-mid text-sm uppercase tracking-widest mb-4">Resultados reais</p>
          <blockquote className="text-2xl font-black text-white leading-snug mb-6">
            "Caso âncora com resultado mensurável — em breve."
          </blockquote>
          <p className="text-dalton-gray-light text-sm">
            Estamos coletando os primeiros resultados dos beta testers.<br />
            Você pode ser um deles.
          </p>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Criar PricingWaitlist.tsx**

```tsx
// components/sections/PricingWaitlist.tsx
import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'

interface PricingRow {
  label: string
  value: string
}

interface PricingWaitlistProps {
  rows: PricingRow[]
  onCTA: () => void
}

export function PricingWaitlist({ rows, onCTA }: PricingWaitlistProps) {
  return (
    <section className="py-20 px-6 bg-white/[0.01]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 text-center leading-tight">
          Seja um dos primeiros a testar.
        </h2>
        <p className="text-dalton-gray-light text-center mb-10 text-lg">
          Estamos abrindo vagas para os primeiros clientes — com acompanhamento direto do time da Dalton Lab.
        </p>

        <div className="glass-card border border-dalton-cyan/20 overflow-hidden">
          <table className="w-full" role="table">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 text-dalton-gray-light text-sm">{row.label}</td>
                  <td className="px-6 py-4 text-white font-semibold text-sm text-right">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center mt-8 gap-3">
          <Button size="lg" onClick={onCTA} className="w-full max-w-sm">
            Garantir meu lugar →
          </Button>
          <div className="flex items-center gap-2 text-dalton-gray-mid text-sm">
            <Check size={14} className="text-dalton-cyan flex-shrink-0" />
            Sem contrato anual. Cancele quando quiser.
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Criar FAQSection.tsx**

```tsx
// components/sections/FAQSection.tsx
'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export function FAQSection({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-white mb-10 text-center">Perguntas frequentes</h2>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 focus-visible:ring-2 focus-visible:ring-dalton-cyan focus-visible:ring-inset"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-white font-semibold leading-snug">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-dalton-cyan transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                hidden={open !== i}
                className="px-6 pb-5"
              >
                <p className="text-dalton-gray-light leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add components/sections/
git commit -m "feat: section components (Hero, Pain, Solution, SocialProof, Pricing, FAQ)"
```

---

## Task 7: Hub Page (`/`)

**Files:**
- Modify: `app/page.tsx`

Fonte: `Spec — Hub soluções.daltonlab.ai.md`

- [ ] **Step 1: Escrever app/page.tsx**

```tsx
// app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Dalton Lab — Você toca tudo na sua empresa. A gente resolve o que toma mais tempo.',
  description: 'Ferramentas de IA prontas para usar para PME. Sem contratar ninguém, sem montar do zero.',
}

const products = [
  {
    href: '/radar',
    name: 'Radar',
    tagline: 'Veja exatamente o que funciona no seu Instagram — e pare de postar no escuro.',
    price: 'R$ 297/mês',
    status: 'pronto' as const,
    cta: 'Assinar agora',
  },
  {
    href: '/sdr',
    name: 'SDR WhatsApp',
    tagline: 'Seu WhatsApp atende, classifica e responde seus leads — mesmo quando você não está.',
    price: 'Em breve · R$ 297/mês',
    status: 'breve' as const,
    cta: 'Garantir meu lugar',
  },
  {
    href: '/propostas',
    name: 'Gerador de Propostas',
    tagline: 'Do CRM para a proposta pronta em menos de 1 minuto — sem abrir o PowerPoint.',
    price: 'Em breve · R$ 297/mês',
    status: 'breve' as const,
    cta: 'Garantir meu lugar',
  },
  {
    href: '/crm',
    name: 'Transcrição + CRM',
    tagline: 'Cada reunião vira resumo e tarefa no CRM automaticamente — sem você digitar nada.',
    price: 'Em breve · R$ 297/mês',
    status: 'breve' as const,
    cta: 'Garantir meu lugar',
  },
]

export default function HubPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <Badge>Operação Ignição</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Você toca tudo na sua empresa.{' '}
            <span className="gradient-text">A gente resolve o que toma mais tempo.</span>
          </h1>
          <p className="text-lg md:text-xl text-dalton-gray-light max-w-2xl leading-relaxed">
            A Dalton Lab cria ferramentas prontas para usar — sem precisar contratar ninguém, sem montar do zero. Escolha o que faz sentido para o seu negócio agora.
          </p>
          <Button size="lg" asChild>
            <a href="#solucoes">Ver soluções</a>
          </Button>
        </div>
      </section>

      {/* Qualificação */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-dalton-gray-light text-lg leading-relaxed">
            Cada produto resolve um problema específico. Alguns já estão prontos — você pode assinar hoje. Outros chegam em breve, e você pode reservar o seu lugar antes do lançamento.
          </p>
        </div>
      </section>

      {/* Produtos */}
      <section id="solucoes" className="py-16 px-6" aria-labelledby="produtos-title">
        <div className="max-w-6xl mx-auto">
          <h2 id="produtos-title" className="sr-only">Soluções Dalton Lab</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <article key={p.href} className="glass-card p-8 flex flex-col gap-4 border-t-2 border-dalton-cyan/20 hover:border-dalton-cyan/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">{p.name}</h3>
                  {p.status === 'pronto' ? (
                    <span className="text-xs font-bold uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
                      Disponível
                    </span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-widest text-dalton-cyan bg-dalton-cyan/10 border border-dalton-cyan/20 px-3 py-1 rounded-full">
                      Em breve
                    </span>
                  )}
                </div>
                <p className="text-dalton-gray-light leading-relaxed flex-1">{p.tagline}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-dalton-gray-mid text-sm">{p.price}</p>
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-2 text-dalton-cyan text-sm font-semibold hover:gap-3 transition-all duration-150 focus-visible:outline-none focus-visible:underline"
                  >
                    {p.cta} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Prova social âncora */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="divider-glow mb-12" />
          <div className="text-center">
            <p className="text-dalton-gray-light text-lg leading-relaxed">
              Mais de <span className="text-white font-bold">3 milhões de visualizações</span> já rastreadas pelo Radar, nosso primeiro produto. Cada ferramenta que lançamos resolve um problema específico — com dado, não com promessa.
            </p>
          </div>
        </div>
      </section>

      {/* Confiança */}
      <section className="py-16 px-6 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <p className="text-dalton-gray-light text-lg leading-relaxed">
            A Dalton Lab é uma empresa de tecnologia brasileira. Cada ferramenta é desenvolvida com foco em resultado, não em funcionalidade.{' '}
            <span className="text-white font-medium">Se não entregar, você cancela na hora.</span>
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Sem contrato anual', 'Setup em horas', 'Suporte direto com o time'].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-dalton-gray-light bg-white/5 px-4 py-2 rounded-full">
                <Check size={14} className="text-dalton-cyan flex-shrink-0" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <Link href="/radar">
            <Button variant="secondary" size="md">
              Conheça o Radar, nosso primeiro produto →
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
```

Nota: o `Button` precisa aceitar `asChild`. Adicionar suporte no `Button.tsx`:

```tsx
// Em Button.tsx, adicionar prop asChild e usar Slot do Radix:
// Instalar: npm install @radix-ui/react-slot
// Adicionar import { Slot } from '@radix-ui/react-slot'
// Na interface: asChild?: boolean
// No render: const Comp = asChild ? Slot : 'button'
// Usar: <Comp ...>
```

```bash
npm install @radix-ui/react-slot
```

Atualizar `Button.tsx` com suporte a `asChild` usando `Slot` do Radix.

- [ ] **Step 2: Verificar hub no browser**

```bash
npm run dev
```

Acessar http://localhost:3000 e checar:
- Hero com headline e CTA
- 4 cards de produtos com badge de status
- Seção de prova social
- Seção de confiança com link para /radar

- [ ] **Step 3: Verificar responsividade**

Redimensionar para 375px. Os cards devem empilhar em coluna única.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx components/ui/Button.tsx
git commit -m "feat: hub page com 4 produtos, prova social e seção de confiança"
```

---

## Task 8: LP SDR WhatsApp (`/sdr`)

**Files:**
- Create: `app/sdr/page.tsx`

Fonte: `Spec — SDR WhatsApp.md`

- [ ] **Step 1: Criar app/sdr/page.tsx**

```tsx
// app/sdr/page.tsx
'use client'
import { useState } from 'react'
import type { Metadata } from 'next'
import { HeroLP } from '@/components/sections/HeroLP'
import { PainSection } from '@/components/sections/PainSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { SocialProofPlaceholder } from '@/components/sections/SocialProofPlaceholder'
import { PricingWaitlist } from '@/components/sections/PricingWaitlist'
import { FAQSection } from '@/components/sections/FAQSection'
import { WaitlistModal } from '@/components/WaitlistModal'
import { Button } from '@/components/ui/Button'

// Nota: metadata não funciona com 'use client'. Mover para um layout ou usar generateMetadata separado.
// Por ora, os metadados serão definidos em um wrapper server component se necessário.

const PRODUCT = 'sdr'
const PRODUCT_LABEL = 'SDR WhatsApp'

const faqItems = [
  {
    question: 'Vai parecer robô para o meu cliente?',
    answer: 'Não. O SDR é treinado com a linguagem da sua empresa — tom, vocabulário, produtos. Seus clientes vão achar que é um atendente humano muito ágil.',
  },
  {
    question: 'Funciona com qualquer número de WhatsApp?',
    answer: 'Funciona com WhatsApp Business API. Se você ainda não tem, a gente te ajuda a configurar no onboarding.',
  },
  {
    question: 'E se o cliente quiser falar com uma pessoa?',
    answer: 'O SDR identifica quando o cliente quer falar com humano e faz o handoff imediato — com todo o histórico da conversa para o vendedor.',
  },
  {
    question: 'Quanto tempo leva para colocar no ar?',
    answer: 'Onboarding em horas. Você preenche as informações da empresa, a gente configura, você aprova. Sem semanas de implementação.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Cancela quando quiser, sem multa. A gente prefere cliente que fica porque funciona, não porque está preso.',
  },
]

const pricingRows = [
  { label: 'Preço de lançamento', value: 'R$ 297/mês' },
  { label: 'Contrato', value: 'Mensal, sem fidelidade' },
  { label: 'Setup', value: 'Zero — onboarding em horas' },
  { label: 'Suporte no lançamento', value: 'Direto com o time' },
]

export default function SDRWhatsAppPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <HeroLP
        badge="SDR WhatsApp"
        headline="Seu WhatsApp atende — mesmo quando você não está."
        subheadline="Lead que espera mais de 5 minutos tem 10x menos chance de comprar. O SDR WhatsApp responde, classifica e qualifica — e só chama você quando o cliente está pronto."
        onCTA={() => setModalOpen(true)}
      />

      <PainSection
        title="Você está perdendo venda toda hora — e nem sabe."
        body={[
          'Leads chegam de manhã cedo, no almoço, depois das 18h. Sua equipe não consegue responder tudo. O cliente manda mensagem, não recebe resposta em 5 minutos — e compra do concorrente.',
          'Não é falta de vendedor. É falta de um primeiro atendimento que funcione no tempo certo.',
        ]}
        stats={[
          { value: '200+', label: 'leads/dia sem resposta em pico (caso real: setor odontológico)' },
          { value: '100%', label: 'das PMEs de varejo e distribuição usam WhatsApp como canal principal de vendas' },
          { value: '0', label: 'delas tinha automação no primeiro atendimento' },
        ]}
      />

      <SolutionSection
        title="Um SDR que nunca dorme, nunca esquece, nunca perde contexto."
        steps={[
          {
            number: '1',
            title: 'Atende na hora',
            description: 'Responde o lead em segundos, com a linguagem da sua empresa, 24h por dia.',
          },
          {
            number: '2',
            title: 'Classifica e qualifica',
            description: 'Entende o que o cliente precisa, busca no catálogo se for varejo, coleta as informações que o vendedor precisaria pedir.',
          },
          {
            number: '3',
            title: 'Passa para o humano com contexto',
            description: 'Quando o lead está pronto, o vendedor recebe um resumo completo e entra na conversa sem começar do zero.',
          },
        ]}
        closing="Não é um bot genérico. É um SDR treinado no seu negócio."
      />

      <SocialProofPlaceholder />

      <PricingWaitlist rows={pricingRows} onCTA={() => setModalOpen(true)} />

      <FAQSection items={faqItems} />

      {/* CTA fixo mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden p-4 bg-dalton-bg/90 backdrop-blur border-t border-white/5 z-40">
        <Button size="lg" onClick={() => setModalOpen(true)} className="w-full">
          Garantir meu lugar →
        </Button>
      </div>

      <WaitlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={PRODUCT}
        productLabel={PRODUCT_LABEL}
      />
    </>
  )
}
```

- [ ] **Step 2: Verificar LP no browser**

Acessar http://localhost:3000/sdr. Verificar:
- Hero com headline correta
- 3 seções de conteúdo
- Botão "Garantir meu lugar" abre o modal
- CTA fixo aparece em mobile (375px) e some em desktop

- [ ] **Step 3: Commit**

```bash
git add app/sdr/
git commit -m "feat: LP SDR WhatsApp com todas as seções e waitlist modal"
```

---

## Task 9: LP Gerador de Propostas (`/propostas`)

**Files:**
- Create: `app/propostas/page.tsx`

Fonte: `Spec — Gerador de Propostas.md`

- [ ] **Step 1: Criar app/propostas/page.tsx**

```tsx
// app/propostas/page.tsx
'use client'
import { useState } from 'react'
import { HeroLP } from '@/components/sections/HeroLP'
import { PainSection } from '@/components/sections/PainSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { SocialProofPlaceholder } from '@/components/sections/SocialProofPlaceholder'
import { PricingWaitlist } from '@/components/sections/PricingWaitlist'
import { FAQSection } from '@/components/sections/FAQSection'
import { WaitlistModal } from '@/components/WaitlistModal'
import { Button } from '@/components/ui/Button'

const PRODUCT = 'propostas'
const PRODUCT_LABEL = 'Gerador de Propostas'

const faqItems = [
  {
    question: 'Funciona com o CRM que eu uso?',
    answer: 'Funciona com Kommo, HubSpot e Pipedrive nativamente. Se você usa outro, a gente avalia na conversa de onboarding.',
  },
  {
    question: 'Posso usar o meu próprio template de proposta?',
    answer: 'Sim. Você sobe o template da sua empresa (PPT ou Word) e o sistema preenche nos campos que você definir. O visual continua sendo o seu.',
  },
  {
    question: 'E se os dados do CRM estiverem incompletos?',
    answer: 'O sistema avisa antes de gerar a proposta quais campos estão faltando — você completa ou deixa o vendedor completar antes de enviar.',
  },
  {
    question: 'O cliente vai saber que foi gerado automaticamente?',
    answer: 'Não. A proposta tem o visual e a linguagem da sua empresa. Para o cliente, é uma proposta normal — só muito mais rápida.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Cancela quando quiser, sem multa. Sem fidelidade, sem contrato anual obrigatório.',
  },
]

const pricingRows = [
  { label: 'Preço de lançamento', value: 'R$ 297/mês' },
  { label: 'Contrato', value: 'Mensal, sem fidelidade' },
  { label: 'Setup', value: 'Você sobe o template uma vez' },
  { label: 'Suporte no lançamento', value: 'Direto com o time' },
]

export default function GeradorPropostasPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <HeroLP
        badge="Gerador de Propostas"
        headline="Proposta pronta em 1 minuto — direto do seu CRM."
        subheadline="Chega de copiar e colar dado de lead no PowerPoint. O Gerador de Propostas puxa as informações do seu CRM, preenche no seu template e manda pro cliente — com rastreamento de abertura."
        onCTA={() => setModalOpen(true)}
      />

      <PainSection
        title="41 horas por semana montando proposta não é processo — é desperdício."
        body={[
          'Um vendedor que leva 10 minutos por proposta e manda 250 por mês gasta 41 horas só nisso. Horas que deveriam estar em reunião, em follow-up, em fechar.',
          'E no final, o cliente abre o PDF, vê que tem erro de digitação ou dado errado, e a credibilidade vai junto.',
        ]}
        stats={[
          { value: '250', label: 'propostas/semana manuais (caso real: empresa de eventos)' },
          { value: '41h', label: 'por semana perdidas em trabalho que uma máquina faz' },
          { value: '4+', label: 'empresas classificaram essa dor como CRÍTICA na pesquisa Dalton Lab' },
        ]}
      />

      <SolutionSection
        title="Do lead aprovado à proposta enviada — sem abrir o PowerPoint."
        steps={[
          {
            number: '1',
            title: 'Conecta ao seu CRM',
            description: 'Kommo, HubSpot, Pipedrive ou planilha. Puxa os dados do lead automaticamente: nome, empresa, produto de interesse, valor.',
          },
          {
            number: '2',
            title: 'Preenche no seu template',
            description: 'Você define o template uma vez. O sistema preenche, formata e gera o PDF ou PPTX com os dados certos.',
          },
          {
            number: '3',
            title: 'Envia e rastreia',
            description: 'Manda por email ou WhatsApp direto da plataforma. Você recebe notificação quando o cliente abre — e sabe a hora certa de ligar.',
          },
        ]}
        closing="Sem copiar e colar. Sem erros de digitação. Sem esperar o assistente ter tempo."
      />

      <SocialProofPlaceholder />

      <PricingWaitlist rows={pricingRows} onCTA={() => setModalOpen(true)} />

      <FAQSection items={faqItems} />

      <div className="fixed bottom-0 left-0 right-0 md:hidden p-4 bg-dalton-bg/90 backdrop-blur border-t border-white/5 z-40">
        <Button size="lg" onClick={() => setModalOpen(true)} className="w-full">
          Garantir meu lugar →
        </Button>
      </div>

      <WaitlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={PRODUCT}
        productLabel={PRODUCT_LABEL}
      />
    </>
  )
}
```

- [ ] **Step 2: Verificar LP no browser**

Acessar http://localhost:3000/propostas. Verificar mesma estrutura do /sdr com copy correto.

- [ ] **Step 3: Commit**

```bash
git add app/propostas/
git commit -m "feat: LP Gerador de Propostas com todas as seções e waitlist"
```

---

## Task 10: LP Transcrição + CRM (`/crm`)

**Files:**
- Create: `app/crm/page.tsx`

Fonte: `Spec — Transcrição + CRM.md`

- [ ] **Step 1: Criar app/crm/page.tsx**

```tsx
// app/crm/page.tsx
'use client'
import { useState } from 'react'
import { HeroLP } from '@/components/sections/HeroLP'
import { PainSection } from '@/components/sections/PainSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { SocialProofPlaceholder } from '@/components/sections/SocialProofPlaceholder'
import { PricingWaitlist } from '@/components/sections/PricingWaitlist'
import { FAQSection } from '@/components/sections/FAQSection'
import { WaitlistModal } from '@/components/WaitlistModal'
import { Button } from '@/components/ui/Button'

const PRODUCT = 'crm'
const PRODUCT_LABEL = 'Transcrição + CRM'

const faqItems = [
  {
    question: 'Funciona com Google Meet e Microsoft Teams?',
    answer: 'Sim, os dois. O bot entra na reunião como participante — você só adiciona o link e ele cuida do resto.',
  },
  {
    question: 'E se a reunião tiver informação confidencial?',
    answer: 'A transcrição fica na sua conta, não é usada para treinar nenhum modelo. Você decide o que vai para o CRM antes de confirmar.',
  },
  {
    question: 'Funciona com qual CRM?',
    answer: 'Integra nativamente com Kommo, HubSpot e Pipedrive. Outros CRMs via webhook — a gente avalia no onboarding.',
  },
  {
    question: 'O cliente na reunião vai saber que tem um bot?',
    answer: 'O bot aparece na lista de participantes como "Transcrição Dalton Lab". É transparente — e na prática ninguém estranha, é cada vez mais comum.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Cancela quando quiser, sem multa. Sem fidelidade, sem contrato anual obrigatório.',
  },
]

const pricingRows = [
  { label: 'Preço de lançamento', value: 'R$ 297/mês' },
  { label: 'Contrato', value: 'Mensal, sem fidelidade' },
  { label: 'Setup', value: 'Zero — funciona no Meet e Teams sem instalar nada' },
  { label: 'Suporte no lançamento', value: 'Direto com o time' },
]

export default function TranscricaoCRMPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <HeroLP
        badge="Transcrição + CRM"
        headline="Cada reunião vira tarefa no CRM — sem você digitar nada."
        subheadline="O que foi decidido na call fica registrado automaticamente: resumo, próximos passos e atualização no CRM. Sem depender de memória, caderno ou assistente."
        onCTA={() => setModalOpen(true)}
      />

      <PainSection
        title="Quantas reuniões importantes você já esqueceu de registrar?"
        body={[
          'Você sai de uma call de vendas com clareza total. Vai para a próxima reunião. No dia seguinte, o cliente manda follow-up e você não lembra o que foi prometido.',
          'Não é falta de atenção. É um processo que depende de memória humana para funcionar — e memória humana falha. Enquanto isso, o CRM fica desatualizado. O pipeline não reflete a realidade. As decisões da semana são baseadas em dado de duas semanas atrás.',
        ]}
        stats={[
          { value: '100%', label: 'das notas de reunião criadas manualmente, sem integração ao CRM (pesquisa Dalton Lab)' },
          { value: '1', label: 'pessoa responsável por registrar = risco operacional real' },
          { value: '0', label: 'forecast confiável sem CRM atualizado' },
        ]}
      />

      <SolutionSection
        title="Entra na reunião. Sai com tudo no CRM."
        steps={[
          {
            number: '1',
            title: 'Entra na sua call',
            description: 'O bot entra no Google Meet ou Teams junto com você. Não muda nada no seu processo atual.',
          },
          {
            number: '2',
            title: 'Transcreve e resume',
            description: 'Ao final da reunião, gera um resumo com os pontos principais, decisões e próximos passos — na linguagem do seu negócio.',
          },
          {
            number: '3',
            title: 'Atualiza o CRM',
            description: 'Cria ou atualiza o registro do lead, adiciona as tarefas com prazo e responsável. Você só confere antes de confirmar.',
          },
        ]}
        closing="Nenhum dado some. Nenhum follow-up fica esquecido. O CRM finalmente reflete o que está acontecendo."
      />

      <SocialProofPlaceholder />

      <PricingWaitlist rows={pricingRows} onCTA={() => setModalOpen(true)} />

      <FAQSection items={faqItems} />

      <div className="fixed bottom-0 left-0 right-0 md:hidden p-4 bg-dalton-bg/90 backdrop-blur border-t border-white/5 z-40">
        <Button size="lg" onClick={() => setModalOpen(true)} className="w-full">
          Garantir meu lugar →
        </Button>
      </div>

      <WaitlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={PRODUCT}
        productLabel={PRODUCT_LABEL}
      />
    </>
  )
}
```

- [ ] **Step 2: Verificar LP no browser**

Acessar http://localhost:3000/crm. Verificar copy correto.

- [ ] **Step 3: Commit**

```bash
git add app/crm/
git commit -m "feat: LP Transcrição + CRM com todas as seções e waitlist"
```

---

## Task 11: LP Radar (`/radar`) — Por último

**Files:**
- Create: `app/radar/page.tsx`

Nota: O Radar já tem produto pronto em `https://instagram-data-production.up.railway.app/`. Esta LP é uma página de marketing que direciona para o Stripe (quando o link for fornecido). Por enquanto usar CTA de "Começar agora" → link externo.

- [ ] **Step 1: Criar app/radar/page.tsx**

```tsx
// app/radar/page.tsx
'use client'
import Link from 'next/link'
import { HeroLP } from '@/components/sections/HeroLP'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, ExternalLink } from 'lucide-react'

// CTA aponta para o produto existente ou Stripe — substituir URL quando disponível
const RADAR_URL = process.env.NEXT_PUBLIC_RADAR_URL ?? 'https://instagram-data-production.up.railway.app/'

const faqItems = [
  {
    question: 'Funciona com qualquer conta do Instagram?',
    answer: 'Funciona com qualquer conta conectada via Instagram Business API. Você conecta uma vez, a gente cuida do resto.',
  },
  {
    question: 'Com que frequência os dados são atualizados?',
    answer: 'A análise roda diariamente. Você acorda com o relatório do dia anterior pronto.',
  },
  {
    question: 'Preciso instalar alguma coisa?',
    answer: 'Não. É 100% web. Você acessa pelo navegador, conecta a conta e já tem os primeiros dados.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Cancela quando quiser, sem multa. Sem fidelidade, sem contrato anual obrigatório.',
  },
]

export default function RadarPage() {
  return (
    <>
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <Badge>Disponível agora</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Veja exatamente o que funciona no seu Instagram.{' '}
            <span className="gradient-text">Pare de postar no escuro.</span>
          </h1>
          <p className="text-lg md:text-xl text-dalton-gray-light max-w-2xl leading-relaxed">
            O Radar analisa seu histórico de posts, identifica padrões de engajamento e te diz o que postar, quando postar e por quê — com dado, não com achismo.
          </p>
          <a href={RADAR_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="flex items-center gap-2">
              Começar agora <ExternalLink size={16} aria-hidden="true" />
            </Button>
          </a>
          <p className="text-sm text-dalton-gray-mid">R$ 297/mês · Sem setup · Cancele quando quiser</p>
        </div>
      </section>

      {/* Prova: 3M+ visualizações */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: '3M+', label: 'visualizações rastreadas' },
            { value: '100%', label: 'web — sem instalar nada' },
            { value: '24h', label: 'análise diária automática' },
          ].map(stat => (
            <div key={stat.value} className="glass-card p-6 text-center border-t-2 border-dalton-cyan/30">
              <p className="text-3xl font-black gradient-text mb-2">{stat.value}</p>
              <p className="text-dalton-gray-light text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <SolutionSection
        title="Do dado ao post certo — em 3 passos."
        steps={[
          {
            number: '1',
            title: 'Conecta sua conta',
            description: 'Uma vez só. O Radar acessa seu histórico via Instagram Business API.',
          },
          {
            number: '2',
            title: 'Analisa o que funcionou',
            description: 'Identifica padrões: horário, formato, tema, legenda. Você vê o que realmente gera engajamento — não só curtidas.',
          },
          {
            number: '3',
            title: 'Você posta com direção',
            description: 'Recebe recomendações diárias de conteúdo baseadas em dados do seu próprio perfil.',
          },
        ]}
      />

      <FAQSection items={faqItems} />

      {/* CTA final */}
      <section className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-black text-white">Pronto para parar de adivinhar?</h2>
          <div className="flex flex-col gap-2 text-sm text-dalton-gray-light">
            {['Sem setup', 'Cancele quando quiser', 'Resultado desde o primeiro relatório'].map(item => (
              <div key={item} className="flex items-center gap-2 justify-center">
                <Check size={14} className="text-dalton-cyan" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <a href={RADAR_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Começar agora →</Button>
          </a>
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 2: Adicionar NEXT_PUBLIC_RADAR_URL ao .env.local.example**

```bash
echo "NEXT_PUBLIC_RADAR_URL=https://instagram-data-production.up.railway.app/" >> .env.local.example
```

- [ ] **Step 3: Verificar LP no browser**

Acessar http://localhost:3000/radar. Verificar stats, passos e CTAs.

- [ ] **Step 4: Commit**

```bash
git add app/radar/ .env.local.example
git commit -m "feat: LP Radar com CTA para produto existente"
```

---

## Task 12: Build final + Railway deploy

**Files:**
- Modify: `package.json` (script de start)
- Create: `.dockerignore` (opcional)

- [ ] **Step 1: Verificar build de produção**

```bash
npm run build
```

Esperado: build concluído sem erros. Atenção para warnings de TypeScript ou missing env vars.

- [ ] **Step 2: Corrigir qualquer erro de build**

Erros comuns:
- `'use client'` faltando em componentes com hooks
- `metadata` exportado de arquivo `'use client'` (não é permitido — remover ou mover para um wrapper Server Component)
- Imports de módulos não instalados

- [ ] **Step 3: Testar start de produção localmente**

```bash
npm start
```

Acessar http://localhost:3000 e checar hub + /sdr + /propostas + /crm + /radar.

- [ ] **Step 4: Verificar que .env está no .gitignore**

```bash
grep -n "\.env" .gitignore
```

Esperado: `.env*.local` e `.env` listados. Nunca commitar credenciais.

- [ ] **Step 5: Push e deploy no Railway**

```bash
git add -A
git commit -m "feat: build pronto para deploy"
git push origin main
```

No Railway: conectar o repo GitHub, configurar as env vars:
- `NEXT_PUBLIC_POSTHOG_KEY`
- `NEXT_PUBLIC_POSTHOG_HOST`
- `WAITLIST_API_URL`
- `WAITLIST_API_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_RADAR_URL`

Railway vai detectar Next.js automaticamente via nixpacks.

- [ ] **Step 6: Configurar domínio no Railway**

No painel Railway: Settings → Domains → adicionar `solucoes.daltonlab.ai` (sem acento na configuração DNS, mas com encoding no código).

---

## Checklist de Revisão Final (antes de anunciar)

- [ ] Hub `/` — todos os 4 cards linkam para as LPs corretas
- [ ] `/sdr`, `/propostas`, `/crm` — modal abre, form envia para `/api/waitlist`, mensagem de sucesso aparece
- [ ] `/radar` — CTA aponta para URL correta do produto
- [ ] PostHog: pageview sendo capturado em cada rota (verificar no PostHog dashboard)
- [ ] Mobile 375px: CTA fixo aparece, modal usável, sem horizontal scroll
- [ ] Contraste: texto branco em bg #0a1628 — ratio ok (AAA)
- [ ] FAQ: abre/fecha com teclado (Enter/Space), foco visível
- [ ] Form: submissão com Enter funciona, campos obrigatórios validados, erro de preço aparece se não respondido
- [ ] Build `npm run build` passa sem erros
