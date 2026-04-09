// app/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Dalton Lab — Você toca tudo na sua empresa. A gente resolve o que toma mais tempo.',
  description: 'Ferramentas de IA prontas para usar para PME. Sem contratar ninguém, sem montar do zero.',
}

const products = [
  {
    href: '/radar',
    name: 'Radar',
    tagline: 'Veja exatamente o que funciona no seu Instagram — e pare de postar no escuro.',
    price: 'R$ 297/mês',
    status: 'pronto' as const,
    cta: 'Assinar agora',
  },
  {
    href: '/sdr',
    name: 'SDR WhatsApp',
    tagline: 'Seu WhatsApp atende, classifica e responde seus leads — mesmo quando você não está.',
    price: 'Em breve · R$ 297/mês',
    status: 'breve' as const,
    cta: 'Garantir meu lugar',
  },
  {
    href: '/propostas',
    name: 'Gerador de Propostas',
    tagline: 'Do CRM para a proposta pronta em menos de 1 minuto — sem abrir o PowerPoint.',
    price: 'Em breve · R$ 297/mês',
    status: 'breve' as const,
    cta: 'Garantir meu lugar',
  },
  {
    href: '/crm',
    name: 'Transcrição + CRM',
    tagline: 'Cada reunião vira resumo e tarefa no CRM automaticamente — sem você digitar nada.',
    price: 'Em breve · R$ 297/mês',
    status: 'breve' as const,
    cta: 'Garantir meu lugar',
  },
]

export default function HubPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <Badge>Operação Ignição</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Você toca tudo na sua empresa.{' '}
            <span className="gradient-text">A gente resolve o que toma mais tempo.</span>
          </h1>
          <p className="text-lg md:text-xl text-dalton-gray-light max-w-2xl leading-relaxed">
            A Dalton Lab cria ferramentas prontas para usar — sem precisar contratar ninguém, sem montar do zero. Escolha o que faz sentido para o seu negócio agora.
          </p>
          <Button size="lg" asChild>
            <a href="#solucoes">Ver soluções</a>
          </Button>
        </div>
      </section>

      {/* Qualificação */}
      <section className="py-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-dalton-gray-light text-lg leading-relaxed">
            Cada produto resolve um problema específico. Alguns já estão prontos — você pode assinar hoje. Outros chegam em breve, e você pode reservar o seu lugar antes do lançamento.
          </p>
        </div>
      </section>

      {/* Produtos */}
      <section id="solucoes" className="py-16 px-6" aria-labelledby="produtos-title">
        <div className="max-w-6xl mx-auto">
          <h2 id="produtos-title" className="sr-only">Soluções Dalton Lab</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map(p => (
              <article key={p.href} className="glass-card p-8 flex flex-col gap-4 border-t-2 border-dalton-cyan/20 hover:border-dalton-cyan/50 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white">{p.name}</h3>
                  {p.status === 'pronto' ? (
                    <span className="text-xs font-bold uppercase tracking-widest text-green-400 bg-green-400/10 border border-green-400/20 px-3 py-1 rounded-full">
                      Disponível
                    </span>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-widest text-dalton-cyan bg-dalton-cyan/10 border border-dalton-cyan/20 px-3 py-1 rounded-full">
                      Em breve
                    </span>
                  )}
                </div>
                <p className="text-dalton-gray-light leading-relaxed flex-1">{p.tagline}</p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-dalton-gray-mid text-sm">{p.price}</p>
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-2 text-dalton-cyan text-sm font-semibold hover:gap-3 transition-all duration-150 focus-visible:outline-none focus-visible:underline"
                  >
                    {p.cta} <ArrowRight size={16} aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Prova social âncora */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="divider-glow mb-12" />
          <div className="text-center">
            <p className="text-dalton-gray-light text-lg leading-relaxed">
              Mais de <span className="text-white font-bold">3 milhões de visualizações</span> já rastreadas pelo Radar, nosso primeiro produto. Cada ferramenta que lançamos resolve um problema específico — com dado, não com promessa.
            </p>
          </div>
        </div>
      </section>

      {/* Confiança */}
      <section className="py-16 px-6 bg-white/[0.01]">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
          <p className="text-dalton-gray-light text-lg leading-relaxed">
            A Dalton Lab é uma empresa de tecnologia brasileira. Cada ferramenta é desenvolvida com foco em resultado, não em funcionalidade.{' '}
            <span className="text-white font-medium">Se não entregar, você cancela na hora.</span>
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {['Sem contrato anual', 'Setup em horas', 'Suporte direto com o time'].map(item => (
              <div key={item} className="flex items-center gap-2 text-sm text-dalton-gray-light bg-white/5 px-4 py-2 rounded-full">
                <Check size={14} className="text-dalton-cyan flex-shrink-0" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <Link href="/radar">
            <Button variant="secondary" size="md">
              Conheça o Radar, nosso primeiro produto →
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}
