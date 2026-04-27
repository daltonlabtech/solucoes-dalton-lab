'use client'
import { useState } from 'react'
import LandingHero from '@/components/landing/linkedin/LandingHero'
import LandingVideoDemo from '@/components/landing/linkedin/LandingVideoDemo'
import LandingBenefits from '@/components/landing/linkedin/LandingBenefits'
import LandingPricing from '@/components/landing/linkedin/LandingPricing'
import LandingFAQ from '@/components/landing/linkedin/LandingFAQ'
import { WaitlistModal } from '@/components/WaitlistModal'
import { Button } from '@/components/ui/Button'

const PRODUCT = 'linkedin'
const PRODUCT_LABEL = 'Linkedin Post'

export default function LinkedInPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div>
      <LandingHero onCTA={() => setModalOpen(true)} />
      <LandingVideoDemo />
      <LandingBenefits />
      <LandingPricing onCTA={() => setModalOpen(true)} />
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
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#1D4ED8] transition-colors text-base"
        >
          Quero acesso antecipado
        </button>
      </section>

      {/* CTA fixo mobile */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden p-4 bg-dalton-bg/90 backdrop-blur border-t border-white/5 z-40">
        <Button size="lg" onClick={() => setModalOpen(true)} className="w-full">
          Quero acesso antecipado →
        </Button>
      </div>

      <WaitlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={PRODUCT}
        productLabel={PRODUCT_LABEL}
      />
    </div>
  )
}
