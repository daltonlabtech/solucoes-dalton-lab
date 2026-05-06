import type { Metadata } from 'next'
import LandingHero from '@/components/landing/linkedin/LandingHero'
import LandingVideoDemo from '@/components/landing/linkedin/LandingVideoDemo'
import LandingBenefits from '@/components/landing/linkedin/LandingBenefits'
import LandingPricing from '@/components/landing/linkedin/LandingPricing'
import LandingFAQ from '@/components/landing/linkedin/LandingFAQ'

export const metadata: Metadata = {
  title: 'Gerador de Posts LinkedIn — Dalton Lab',
  description: 'Crie posts alinhados à voz da sua empresa e publique direto no LinkedIn. 100 posts por mês, com IA treinada na sua marca.',
}

const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_STRIPE_PAYMENT_LINK_LINKEDIN ??
  'https://buy.stripe.com/eVq3cv6HsfTl2nJbcZfYY0B'

export default function LinkedInPage() {
  return (
    <div>
      <LandingHero checkoutUrl={CHECKOUT_URL} />
      <LandingVideoDemo />
      <LandingBenefits />
      <LandingPricing checkoutUrl={CHECKOUT_URL} />
      <LandingFAQ />

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
          Sua marca no LinkedIn. Todos os dias.
        </h2>
        <p className="text-white/60 mb-10 max-w-md mx-auto text-base leading-relaxed">
          Primeiro post em minutos. Cancele quando quiser.
        </p>
        <a
          href={CHECKOUT_URL}
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1D4ED8] transition-colors text-base"
        >
          Comprar Agora
          <span className="text-white/60 font-normal">— R$99/mês</span>
        </a>
      </section>
    </div>
  )
}
