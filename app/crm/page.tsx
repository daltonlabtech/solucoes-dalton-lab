// app/crm/page.tsx
'use client'
import { useState } from 'react'
import { HeroLP } from '@/components/sections/HeroLP'
import { PainSection } from '@/components/sections/PainSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { PricingWaitlist } from '@/components/sections/PricingWaitlist'
import { FAQSection } from '@/components/sections/FAQSection'
import { WaitlistModal } from '@/components/WaitlistModal'
import { Button } from '@/components/ui/Button'

const PRODUCT = 'crm'
const PRODUCT_LABEL = 'Transcrição de Reuniões'

const faqItems = [
  {
    question: 'Funciona com Google Meet e Microsoft Teams?',
    answer: 'Sim, os dois. O bot entra na reunião como participante — você só adiciona o link e ele cuida do resto.',
  },
  {
    question: 'E se a reunião tiver informação confidencial?',
    answer: 'A transcrição fica na sua conta, não é usada para treinar nenhum modelo. Você decide o que vai para o CRM antes de confirmar.',
  },
  {
    question: 'Funciona com qual CRM?',
    answer: 'Integra nativamente com Kommo, HubSpot e Pipedrive. Outros CRMs via webhook — a gente avalia no onboarding.',
  },
  {
    question: 'O cliente na reunião vai saber que tem um bot?',
    answer: 'O bot aparece na lista de participantes como "Transcrição Dalton Lab". É transparente — e na prática ninguém estranha, é cada vez mais comum.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Cancela quando quiser, sem multa. Sem fidelidade, sem contrato anual obrigatório.',
  },
]

const pricingRows = [
  { label: 'Contrato', value: 'Mensal, sem fidelidade' },
  { label: 'Setup', value: 'Zero — funciona no Meet e Teams sem instalar nada' },
  { label: 'Suporte no lançamento', value: 'Direto com o time' },
]

export default function TranscricaoCRMPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div style={{ '--lp-accent': '#14B8A6' } as React.CSSProperties}>
      <HeroLP
        badge="CRM sempre desatualizado?"
        headline="Cada reunião vira tarefa no CRM — sem você digitar nada."
        subheadline="O que ficou decidido na call entra no CRM automaticamente — resumo, próximos passos e tarefas. Sem depender de memória."
        ctaLabel="Conectar meu CRM →"
        onCTA={() => setModalOpen(true)}
      />

      <PainSection
        title="Quantas reuniões importantes você já esqueceu de registrar?"
        body={[
          'Você sai de uma call de vendas com clareza total. Vai para a próxima reunião. No dia seguinte, o cliente manda follow-up e você não lembra o que foi prometido.',
          'Não é falta de atenção. É um processo que depende de memória humana para funcionar — e memória humana falha. Enquanto isso, o CRM fica desatualizado. O pipeline não reflete a realidade. As decisões da semana são baseadas em dado de duas semanas atrás.',
        ]}
        stats={[
          { value: '100%', label: 'das reuniões sem transcrição dependem de memória para virar tarefa no CRM' },
          { value: '1', label: 'pessoa responsável por registrar = risco operacional real' },
          { value: '0', label: 'forecast confiável sem CRM atualizado' },
        ]}
      />

      <SolutionSection
        title="Entra na reunião. Sai com tudo no CRM."
        steps={[
          {
            number: '1',
            title: 'Entra na sua call',
            description: 'O bot entra no Google Meet ou Teams junto com você. Não muda nada no seu processo atual.',
          },
          {
            number: '2',
            title: 'Transcreve e resume',
            description: 'Ao final da reunião, gera um resumo com os pontos principais, decisões e próximos passos — na linguagem do seu negócio.',
          },
          {
            number: '3',
            title: 'Atualiza o CRM',
            description: 'Cria ou atualiza o registro do lead, adiciona as tarefas com prazo e responsável. Você só confere antes de confirmar.',
          },
        ]}
        closing="Nenhum dado some. Nenhum follow-up fica esquecido. O CRM finalmente reflete o que está acontecendo."
      />

      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="divider-glow mb-16" />
          <div className="glass-card p-10 text-center border border-dalton-cyan/10">
            <p className="text-dalton-gray-mid text-sm uppercase tracking-widest mb-4">Como usamos internamente</p>
            <blockquote className="text-2xl font-black text-white leading-snug mb-6">
              &quot;O preenchimento manual de CRM simplesmente acabou.&quot;
            </blockquote>
            <p className="text-dalton-gray-light text-base max-w-xl mx-auto mb-4">
              Na Dalton Lab, toda reunião comercial é transcrita automaticamente e enriquece o CRM sem nenhuma digitação.
              Nenhuma informação perdida. Nenhum campo desatualizado.
            </p>
            <p className="text-dalton-gray-light text-sm">
              Construímos esse produto porque tínhamos exatamente esse problema.
            </p>
            <p className="text-dalton-gray-mid text-sm mt-4">— Equipe Dalton Lab</p>
          </div>
        </div>
      </section>

      <PricingWaitlist rows={pricingRows} onCTA={() => setModalOpen(true)} />

      <FAQSection items={faqItems} />

      <div className="fixed bottom-0 left-0 right-0 md:hidden p-4 bg-dalton-bg/90 backdrop-blur border-t border-white/5 z-40">
        <Button size="lg" onClick={() => setModalOpen(true)} className="w-full">
          Garantir meu lugar →
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
