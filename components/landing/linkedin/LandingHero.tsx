'use client';

import { trackCtaClick } from '@/lib/posthog';

interface Props {
  checkoutUrl: string;
}

const trustBadges = [
  { value: '100', label: 'posts por mês' },
  { value: '2 min', label: 'do briefing ao post' },
  { value: '1 clique', label: 'publicação no LinkedIn' },
];

export default function LandingHero({ checkoutUrl }: Props) {
  return (
    <section style={{ background: '#0C0C0E' }} className="relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #2563EB 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span className="text-white/65 text-xs font-medium tracking-widest uppercase">
            Gerador de posts com IA · LinkedIn
          </span>
        </div>

        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-5xl md:text-7xl text-white leading-[1.05] mb-6 max-w-3xl"
        >
          Sua marca no LinkedIn. Todos os dias.
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-xl mb-10 leading-relaxed">
          O gerador de posts com IA da Dalton Lab cria conteúdo alinhado à voz da sua empresa — pronto para publicar, direto no LinkedIn.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-10">
          <a
            href={checkoutUrl}
            onClick={(e) => { e.preventDefault(); trackCtaClick(checkoutUrl, 'hero', 'linkedin'); }}
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#1D4ED8] transition-colors text-base"
          >
            Comprar Agora
            <span className="text-white/60 font-normal">— R$99/mês</span>
          </a>
          <span className="text-white/55 text-sm">100 posts por mês · Cancele quando quiser</span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {trustBadges.map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#F59E0B]" />
              <span
                style={{ fontFamily: 'var(--font-mono)' }}
                className="text-white/70 text-xs tracking-wide"
              >
                <strong>{b.value}</strong> {b.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
