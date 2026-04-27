import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Dalton Lab — Ferramentas de IA para PME',
  description: 'Ferramentas prontas para usar que resolvem o que toma mais tempo na sua empresa. Sem contratar, sem configurar do zero.',
}

const availableProducts = [
  {
    href: '/radar',
    name: 'Radar',
    tagline: 'Veja exatamente o que funciona no seu Instagram — e pare de postar no escuro.',
    metric: '3M+ visualizações rastreadas',
    price: 'R$ 297/mês',
    cta: 'Assinar agora',
    badge: true,
  },
  {
    href: '/linkedin',
    name: 'Linkedin Post',
    tagline: 'Crie posts alinhados à voz da sua empresa e publique direto no LinkedIn com um clique.',
    metric: '100 posts por mês · 2 min do briefing ao post',
    price: 'R$ 99/mês',
    cta: 'Quero acesso antecipado',
    badge: false,
  },
]

const comingSoonProducts = [
  {
    href: '/sdr',
    name: 'SDR WhatsApp',
    tagline: 'Seu WhatsApp atende, classifica e responde seus leads — mesmo quando você não está.',
    painStat: 'Lead sem resposta em 5 min tem 10× menos chance de fechar.',
    price: 'R$ 297/mês no lançamento',
    cta: 'Garantir meu lugar',
  },
  {
    href: '/propostas',
    name: 'Gerador de Propostas',
    tagline: 'Do CRM para a proposta pronta em menos de 1 minuto — sem abrir o PowerPoint.',
    painStat: '41h por mês perdidas em proposta manual — por vendedor.',
    price: 'R$ 297/mês no lançamento',
    cta: 'Garantir meu lugar',
  },
  {
    href: '/crm',
    name: 'Transcrição + CRM',
    tagline: 'Cada reunião vira resumo e tarefa no CRM automaticamente — sem você digitar nada.',
    painStat: '100% das notas de reunião criadas sem integração ao CRM.',
    price: 'R$ 297/mês no lançamento',
    cta: 'Garantir meu lugar',
  },
]

export default function HubPage() {
  return (
    <div className="bg-dalton-bg min-h-screen">

      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 py-28 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(circle at 50% 40%, rgba(124,58,237,0.08) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Você toca tudo na empresa.{' '}
            <span className="gradient-text">Deixa o trabalho pesado com a gente.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
            Ferramentas que você liga em horas, não meses. Sem contratar, sem configurar do zero. Se não entregar resultado, você cancela — sem multa.
          </p>
          <Button size="lg" asChild>
            <a href="#solucoes">Ver as ferramentas</a>
          </Button>
        </div>
      </section>

      {/* Produtos */}
      <section id="solucoes" className="py-16 px-6" aria-labelledby="produtos-title">
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
          <h2 id="produtos-title" className="sr-only">Soluções Dalton Lab</h2>

          {/* Produtos disponíveis */}
          {availableProducts.map(p => (
            <article key={p.href} className="relative bg-white/5 rounded-2xl p-8 flex flex-col md:flex-row md:items-center gap-6 border border-white/10 overflow-hidden hover:border-dalton-cyan/30 transition-all duration-200">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-cyan-purple" aria-hidden="true" />

              <div className="flex-1 flex flex-col gap-3 mt-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-white">{p.name}</h3>
                  {p.badge && (
                    <span className="text-xs font-bold uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
                      Disponível agora
                    </span>
                  )}
                </div>
                <p className="text-slate-300 leading-relaxed text-lg">{p.tagline}</p>
                <p className="text-slate-300 text-sm">{p.metric} · {p.price}</p>
              </div>

              <div className="flex-shrink-0">
                <Link href={p.href}>
                  <Button size="lg">
                    {p.cta} <ArrowRight size={16} className="ml-1" aria-hidden="true" />
                  </Button>
                </Link>
              </div>
            </article>
          ))}

          {/* Acesso antecipado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {comingSoonProducts.map(p => (
              <article
                key={p.href}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-dalton-cyan/30 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base font-black text-white">{p.name}</h3>
                  <span className="text-xs font-bold uppercase tracking-widest text-dalton-cyan bg-dalton-cyan/10 border border-dalton-cyan/25 px-2.5 py-1 rounded-full whitespace-nowrap">
                    Acesso antecipado
                  </span>
                </div>

                <p className="text-slate-200 text-sm leading-relaxed">{p.tagline}</p>

                <p className="text-xs text-slate-300 italic border-l-2 border-dalton-cyan/40 pl-3 leading-relaxed">
                  {p.painStat}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2">
                  <p className="text-slate-300 text-xs">{p.price}</p>
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-1.5 text-dalton-cyan text-sm font-semibold hover:gap-2.5 transition-all duration-150 focus-visible:outline-none focus-visible:underline"
                  >
                    {p.cta} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Prova social */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="h-px bg-gradient-to-r from-transparent via-dalton-cyan/30 to-transparent mb-12" />
          <p className="text-slate-200 text-lg leading-relaxed text-center">
            Mais de <span className="text-white font-bold">3 milhões de visualizações</span> já rastreadas pelo Radar. Cada ferramenta que lançamos resolve um problema específico — com dado, não com promessa.
          </p>
        </div>
      </section>

      {/* Confiança */}
      <section className="py-16 px-6 bg-[#0c1e35]">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <p className="text-slate-200 text-lg leading-relaxed">
            Cada ferramenta foi construída para resolver um problema específico — com dado real, não com lista de funcionalidades.{' '}
            <span className="text-white font-medium">Se não funcionar no seu negócio, você cancela. Sem multa, sem fidelidade.</span>
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Sem contrato anual', 'Setup em horas', 'Suporte direto com o time'].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-300 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
                <Check size={14} className="text-dalton-cyan flex-shrink-0" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <Link href="/radar">
            <Button variant="secondary" size="md">
              Começar com o Radar →
            </Button>
          </Link>
        </div>
      </section>

    </div>
  )
}
