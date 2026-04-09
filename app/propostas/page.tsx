// app/propostas/page.tsx
'use client'
import { useState } from 'react'
import { HeroLP } from '@/components/sections/HeroLP'
import { PainSection } from '@/components/sections/PainSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { SocialProofPlaceholder } from '@/components/sections/SocialProofPlaceholder'
import { PricingWaitlist } from '@/components/sections/PricingWaitlist'
import { FAQSection } from '@/components/sections/FAQSection'
import { WaitlistModal } from '@/components/WaitlistModal'
import { Button } from '@/components/ui/Button'

const PRODUCT = 'propostas'
const PRODUCT_LABEL = 'Gerador de Propostas'

const faqItems = [
  {
    question: 'Funciona com o CRM que eu uso?',
    answer: 'Funciona com Kommo, HubSpot e Pipedrive nativamente. Se você usa outro, a gente avalia na conversa de onboarding.',
  },
  {
    question: 'Posso usar o meu próprio template de proposta?',
    answer: 'Sim. Você sobe o template da sua empresa (PPT ou Word) e o sistema preenche nos campos que você definir. O visual continua sendo o seu.',
  },
  {
    question: 'E se os dados do CRM estiverem incompletos?',
    answer: 'O sistema avisa antes de gerar a proposta quais campos estão faltando — você completa ou deixa o vendedor completar antes de enviar.',
  },
  {
    question: 'O cliente vai saber que foi gerado automaticamente?',
    answer: 'Não. A proposta tem o visual e a linguagem da sua empresa. Para o cliente, é uma proposta normal — só muito mais rápida.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Cancela quando quiser, sem multa. Sem fidelidade, sem contrato anual obrigatório.',
  },
]

const pricingRows = [
  { label: 'Preço de lançamento', value: 'R$ 297/mês' },
  { label: 'Contrato', value: 'Mensal, sem fidelidade' },
  { label: 'Setup', value: 'Você sobe o template uma vez' },
  { label: 'Suporte no lançamento', value: 'Direto com o time' },
]

export default function GeradorPropostasPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <HeroLP
        badge="Gerador de Propostas"
        headline="Proposta pronta em 1 minuto — direto do seu CRM."
        subheadline="Chega de copiar e colar dado de lead no PowerPoint. O Gerador de Propostas puxa as informações do seu CRM, preenche no seu template e manda pro cliente — com rastreamento de abertura."
        onCTA={() => setModalOpen(true)}
      />

      <PainSection
        title="41 horas por semana montando proposta não é processo — é desperdício."
        body={[
          'Um vendedor que leva 10 minutos por proposta e manda 250 por mês gasta 41 horas só nisso. Horas que deveriam estar em reunião, em follow-up, em fechar.',
          'E no final, o cliente abre o PDF, vê que tem erro de digitação ou dado errado, e a credibilidade vai junto.',
        ]}
        stats={[
          { value: '250', label: 'propostas/semana manuais (caso real: empresa de eventos)' },
          { value: '41h', label: 'por semana perdidas em trabalho que uma máquina faz' },
          { value: '4+', label: 'empresas classificaram essa dor como CRÍTICA na pesquisa Dalton Lab' },
        ]}
      />

      <SolutionSection
        title="Do lead aprovado à proposta enviada — sem abrir o PowerPoint."
        steps={[
          {
            number: '1',
            title: 'Conecta ao seu CRM',
            description: 'Kommo, HubSpot, Pipedrive ou planilha. Puxa os dados do lead automaticamente: nome, empresa, produto de interesse, valor.',
          },
          {
            number: '2',
            title: 'Preenche no seu template',
            description: 'Você define o template uma vez. O sistema preenche, formata e gera o PDF ou PPTX com os dados certos.',
          },
          {
            number: '3',
            title: 'Envia e rastreia',
            description: 'Manda por email ou WhatsApp direto da plataforma. Você recebe notificação quando o cliente abre — e sabe a hora certa de ligar.',
          },
        ]}
        closing="Sem copiar e colar. Sem erros de digitação. Sem esperar o assistente ter tempo."
      />

      <SocialProofPlaceholder />

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
    </>
  )
}
