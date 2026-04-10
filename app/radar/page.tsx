// app/radar/page.tsx
import type { Metadata } from 'next'
import LandingHero from '@/components/landing/radar/LandingHero'
import LandingPain from '@/components/landing/radar/LandingPain'
import LandingSolution from '@/components/landing/radar/LandingSolution'
import LandingProof from '@/components/landing/radar/LandingProof'
import LandingPricing from '@/components/landing/radar/LandingPricing'
import LandingFAQ from '@/components/landing/radar/LandingFAQ'

export const metadata: Metadata = {
  title: 'Radar — Analytics para criadores de conteúdo',
  description: 'Métricas, relatórios e análise por IA do seu Instagram — sem planilha, sem trabalho manual.',
}

const CHECKOUT_URL = process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK ?? '#'

export default function RadarPage() {
  return (
    <div>
      <LandingHero checkoutUrl={CHECKOUT_URL} />
      <LandingPain />
      <LandingSolution />
      <LandingProof />
      <LandingPricing checkoutUrl={CHECKOUT_URL} />
      <LandingFAQ />

      {/* CTA final */}
      <section style={{ background: '#0C0C0E' }} className="py-24 px-6 text-center">
        <div
          style={{ fontFamily: 'var(--font-mono)' }}
          className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-10"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span className="text-white/50 text-xs font-medium tracking-widest uppercase">
            Pronto para começar?
          </span>
        </div>

        <h2
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-5xl md:text-6xl text-white leading-[1.05] mb-6 max-w-2xl mx-auto"
        >
          Descubra o que realmente funciona no seu Instagram.
        </h2>
        <p className="text-white/60 mb-10 max-w-md mx-auto text-base leading-relaxed">
          Primeiros dados em até 24h. Cancele quando quiser.
        </p>
        <a
          href={CHECKOUT_URL}
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1D4ED8] transition-colors text-base"
        >
          Assinar agora
          <span className="text-white/60 font-normal">— R$297/mês</span>
        </a>
      </section>
    </div>
  )
}
