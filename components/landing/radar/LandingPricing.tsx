'use client';

import posthog from 'posthog-js';

interface Props {
  checkoutUrl: string;
}

const includes = [
  'Dashboard de analytics do Instagram',
  'Relatórios automáticos de performance',
  'Análise por IA dos conteúdos',
  'Cancelamento a qualquer momento',
];

export default function LandingPricing({ checkoutUrl }: Props) {
  return (
    <section style={{ background: '#0C0C0E' }} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p
          style={{ fontFamily: 'var(--font-mono)' }}
          className="text-xs font-semibold tracking-[0.2em] uppercase text-white/30 mb-14"
        >
          Plano
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left: headline */}
          <div>
            <h2
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-5xl md:text-6xl text-white leading-[1.05] mb-6"
            >
              Um plano.<br />Sem surpresa.
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Acesso completo à plataforma. Sem planos básico, intermediário ou premium — só o que funciona.
            </p>
          </div>

          {/* Right: card */}
          <div
            className="rounded-2xl p-8"
            style={{ background: '#111113', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-end gap-2 mb-1">
              <p
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-6xl text-white leading-none"
              >
                R$297
              </p>
              <p className="text-white/30 text-sm mb-2">/mês</p>
            </div>
            <p className="text-white/20 text-xs mb-8 tracking-wide">Cobrado mensalmente</p>

            <ul className="space-y-4 mb-8">
              {includes.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-white/70">
                  <span className="w-1 h-1 rounded-full bg-[#F59E0B] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href={checkoutUrl}
              onClick={(e) => {
                e.preventDefault();
                posthog.capture('cta_clicked', { plan: 'radar', location: 'pricing' });
                setTimeout(() => { window.location.href = checkoutUrl; }, 300);
              }}
              className="flex items-center justify-center gap-2 w-full bg-[#2563EB] text-white font-semibold py-4 rounded-xl hover:bg-[#1D4ED8] transition-colors text-base"
            >
              Assinar agora
            </a>
            <p className="text-white/20 text-xs text-center mt-4">Cancele quando quiser</p>
          </div>
        </div>
      </div>
    </section>
  );
}
