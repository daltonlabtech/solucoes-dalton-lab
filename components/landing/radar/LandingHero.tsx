'use client';

import Image from 'next/image';
import { trackCtaClick } from '@/lib/posthog';

interface Props {
  checkoutUrl: string;
}

const trustBadges = [
  { value: '+3M', label: 'visualizações rastreadas' },
  { value: '738', label: 'posts analisados pela IA' },
  { value: '37', label: 'relatórios gerados' },
];

const socialHandles = [
  { handle: '@misa.antonini', url: 'https://instagram.com/misa.antonini' },
  { handle: '@g4.tools', url: 'https://instagram.com/g4.tools' },
  { handle: '@editoratrinitas', url: 'https://instagram.com/editoratrinitas' },
];

export default function LandingHero({ checkoutUrl }: Props) {
  return (
    <section style={{ background: '#0C0C0E' }} className="relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #2563EB 0%, transparent 70%)' }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 md:pt-28">
        <div className="inline-flex items-center gap-2 border border-white/15 rounded-full px-4 py-1.5 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
          <span className="text-white/65 text-xs font-medium tracking-widest uppercase">
            Radar · Analytics para criadores de conteúdo
          </span>
        </div>

        <h1
          style={{ fontFamily: 'var(--font-display)' }}
          className="text-5xl md:text-7xl text-white leading-[1.05] mb-6 max-w-3xl"
        >
          Você posta todo dia e não sabe o que funciona?
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-lg mb-10 leading-relaxed">
          Métricas, relatórios e análise por IA — sem planilha, sem trabalho manual.
        </p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
          <a
            href={checkoutUrl}
            onClick={(e) => { e.preventDefault(); trackCtaClick(checkoutUrl, 'hero'); }}
            className="inline-flex items-center gap-2 bg-[#2563EB] text-white font-semibold px-7 py-3.5 rounded-lg hover:bg-[#1D4ED8] transition-colors text-base"
          >
            Começar agora
            <span className="text-white/60 font-normal">— R$297/mês</span>
          </a>
          <span className="text-white/55 text-sm">Cancele quando quiser</span>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 mb-6">
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

        <div
          className="flex flex-wrap items-center gap-3 mb-16 pb-6"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <span className="text-white/45 text-xs tracking-widest uppercase" style={{ fontFamily: 'var(--font-mono)' }}>
            Perfis analisados
          </span>
          {socialHandles.map((s) => (
            <a
              key={s.handle}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 text-xs hover:text-white/80 transition-colors"
              style={{ fontFamily: 'var(--font-mono)' }}
            >
              {s.handle}
            </a>
          ))}
        </div>

        <div className="relative">
          <div
            className="absolute -inset-4 opacity-30 rounded-2xl pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 50% 100%, #2563EB 0%, transparent 60%)' }}
          />

          <div className="relative hidden md:block rounded-t-2xl overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/dashboard-screenshot.png"
              alt="Dashboard de analytics do Instagram"
              width={1200}
              height={750}
              className="w-full block"
              sizes="(max-width: 767px) 0px, (max-width: 1280px) 100vw, 1200px"
              priority
            />
          </div>

          <div className="relative md:hidden rounded-2xl overflow-hidden border border-white/10 shadow-2xl" style={{ height: 200 }}>
            <Image
              src="/dashboard-screenshot.png"
              alt="Dashboard de analytics do Instagram"
              fill
              className="object-cover object-left-top"
              sizes="(min-width: 768px) 0px, 100vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
