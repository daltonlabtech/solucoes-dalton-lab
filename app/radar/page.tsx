// app/radar/page.tsx
'use client'
import Link from 'next/link'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { FAQSection } from '@/components/sections/FAQSection'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Check, ExternalLink } from 'lucide-react'

// CTA aponta para o produto existente — substituir por URL do Stripe quando disponível
const RADAR_URL = process.env.NEXT_PUBLIC_RADAR_URL ?? 'https://instagram-data-production.up.railway.app/'

const faqItems = [
  {
    question: 'Funciona com qualquer conta do Instagram?',
    answer: 'Funciona com qualquer conta conectada via Instagram Business API. Você conecta uma vez, a gente cuida do resto.',
  },
  {
    question: 'Com que frequência os dados são atualizados?',
    answer: 'A análise roda diariamente. Você acorda com o relatório do dia anterior pronto.',
  },
  {
    question: 'Preciso instalar alguma coisa?',
    answer: 'Não. É 100% web. Você acessa pelo navegador, conecta a conta e já tem os primeiros dados.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Cancela quando quiser, sem multa. Sem fidelidade, sem contrato anual obrigatório.',
  },
]

export default function RadarPage() {
  return (
    <div style={{ '--lp-accent': '#D97706' } as React.CSSProperties}>
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow pointer-events-none" aria-hidden="true" />
        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          <Badge>Disponível agora</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] tracking-tight">
            Veja exatamente o que funciona no seu Instagram.{' '}
            <span className="gradient-text">Pare de postar no escuro.</span>
          </h1>
          <p className="text-lg md:text-xl text-dalton-gray-light max-w-2xl leading-relaxed">
            O Radar analisa seu histórico de posts, identifica padrões de engajamento e te diz o que postar, quando postar e por quê — com dado, não com achismo.
          </p>
          <a href={RADAR_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="flex items-center gap-2">
              Começar agora <ExternalLink size={16} aria-hidden="true" />
            </Button>
          </a>
          <p className="text-sm text-dalton-gray-mid">R$ 297/mês · Sem setup · Cancele quando quiser</p>
        </div>
      </section>

      {/* Prova: 3M+ visualizações */}
      <section className="py-12 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { value: '3M+', label: 'visualizações rastreadas' },
            { value: '100%', label: 'web — sem instalar nada' },
            { value: '24h', label: 'análise diária automática' },
          ].map(stat => (
            <div key={stat.value} className="glass-card p-6 text-center border-t-2" style={{ borderTopColor: 'color-mix(in srgb, var(--lp-accent) 30%, transparent)' }}>
              <p className="text-3xl font-black gradient-text mb-2">{stat.value}</p>
              <p className="text-dalton-gray-light text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <SolutionSection
        title="Do dado ao post certo — em 3 passos."
        steps={[
          {
            number: '1',
            title: 'Conecta sua conta',
            description: 'Uma vez só. O Radar acessa seu histórico via Instagram Business API.',
          },
          {
            number: '2',
            title: 'Analisa o que funcionou',
            description: 'Identifica padrões: horário, formato, tema, legenda. Você vê o que realmente gera engajamento — não só curtidas.',
          },
          {
            number: '3',
            title: 'Você posta com direção',
            description: 'Recebe recomendações diárias de conteúdo baseadas em dados do seu próprio perfil.',
          },
        ]}
      />

      <FAQSection items={faqItems} />

      {/* CTA final */}
      <section className="py-20 px-6 bg-white/[0.01]">
        <div className="max-w-xl mx-auto text-center flex flex-col items-center gap-6">
          <h2 className="text-3xl font-black text-white">Pronto para parar de adivinhar?</h2>
          <div className="flex flex-col gap-2 text-sm text-dalton-gray-light">
            {['Sem setup', 'Cancele quando quiser', 'Resultado desde o primeiro relatório'].map(item => (
              <div key={item} className="flex items-center gap-2 justify-center">
                <Check size={14} className="text-dalton-cyan" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
          <a href={RADAR_URL} target="_blank" rel="noopener noreferrer">
            <Button size="lg">Começar agora →</Button>
          </a>
        </div>
      </section>
    </div>
  )
}
