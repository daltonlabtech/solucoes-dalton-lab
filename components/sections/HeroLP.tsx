// components/sections/HeroLP.tsx
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface HeroLPProps {
  badge: string
  headline: string
  subheadline: string
  price?: string
  ctaLabel?: string
  onCTA: () => void
}

export function HeroLP({ badge, headline, subheadline, price = 'R$ 297/mês · Sem setup · Cancele quando quiser', ctaLabel = 'Garantir meu lugar →', onCTA }: HeroLPProps) {
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
          {ctaLabel}
        </Button>

        <p className="text-sm text-dalton-gray-mid">{price}</p>
      </div>
    </section>
  )
}
