// app/layout.tsx
import type { Metadata } from 'next'
import { Suspense } from 'react'
import Script from 'next/script'
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
      <Script id="gtm" strategy="afterInteractive">{`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PPF26W8Q');`}</Script>
      <body className="min-h-screen bg-dalton-bg text-dalton-text-body">
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PPF26W8Q" height="0" width="0" style={{display:'none',visibility:'hidden'}} /></noscript>
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
