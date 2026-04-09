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
