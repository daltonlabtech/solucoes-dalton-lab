// app/sdr/page.tsx
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

const PRODUCT = 'sdr'
const PRODUCT_LABEL = 'SDR WhatsApp'

const faqItems = [
  {
    question: 'Vai parecer robô para o meu cliente?',
    answer: 'Não. O SDR é treinado com a linguagem da sua empresa — tom, vocabulário, produtos. Seus clientes vão achar que é um atendente humano muito ágil.',
  },
  {
    question: 'Funciona com qualquer número de WhatsApp?',
    answer: 'Funciona com WhatsApp Business API. Se você ainda não tem, a gente te ajuda a configurar no onboarding.',
  },
  {
    question: 'E se o cliente quiser falar com uma pessoa?',
    answer: 'O SDR identifica quando o cliente quer falar com humano e faz o handoff imediato — com todo o histórico da conversa para o vendedor.',
  },
  {
    question: 'Quanto tempo leva para colocar no ar?',
    answer: 'Onboarding em horas. Você preenche as informações da empresa, a gente configura, você aprova. Sem semanas de implementação.',
  },
  {
    question: 'E se eu quiser cancelar?',
    answer: 'Cancela quando quiser, sem multa. A gente prefere cliente que fica porque funciona, não porque está preso.',
  },
]

const pricingRows = [
  { label: 'Preço de lançamento', value: 'R$ 297/mês' },
  { label: 'Contrato', value: 'Mensal, sem fidelidade' },
  { label: 'Setup', value: 'Zero — onboarding em horas' },
  { label: 'Suporte no lançamento', value: 'Direto com o time' },
]

export default function SDRWhatsAppPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <HeroLP
        badge="SDR WhatsApp"
        headline="Seu WhatsApp atende — mesmo quando você não está."
        subheadline="Lead que espera mais de 5 minutos tem 10x menos chance de comprar. O SDR WhatsApp responde, classifica e qualifica — e só chama você quando o cliente está pronto."
        onCTA={() => setModalOpen(true)}
      />

      <PainSection
        title="Você está perdendo venda toda hora — e nem sabe."
        body={[
          'Leads chegam de manhã cedo, no almoço, depois das 18h. Sua equipe não consegue responder tudo. O cliente manda mensagem, não recebe resposta em 5 minutos — e compra do concorrente.',
          'Não é falta de vendedor. É falta de um primeiro atendimento que funcione no tempo certo.',
        ]}
        stats={[
          { value: '200+', label: 'leads/dia sem resposta em pico (caso real: setor odontológico)' },
          { value: '100%', label: 'das PMEs de varejo e distribuição usam WhatsApp como canal principal de vendas' },
          { value: '0', label: 'delas tinha automação no primeiro atendimento' },
        ]}
      />

      <SolutionSection
        title="Um SDR que nunca dorme, nunca esquece, nunca perde contexto."
        steps={[
          {
            number: '1',
            title: 'Atende na hora',
            description: 'Responde o lead em segundos, com a linguagem da sua empresa, 24h por dia.',
          },
          {
            number: '2',
            title: 'Classifica e qualifica',
            description: 'Entende o que o cliente precisa, busca no catálogo se for varejo, coleta as informações que o vendedor precisaria pedir.',
          },
          {
            number: '3',
            title: 'Passa para o humano com contexto',
            description: 'Quando o lead está pronto, o vendedor recebe um resumo completo e entra na conversa sem começar do zero.',
          },
        ]}
        closing="Não é um bot genérico. É um SDR treinado no seu negócio."
      />

      <SocialProofPlaceholder />

      <PricingWaitlist rows={pricingRows} onCTA={() => setModalOpen(true)} />

      <FAQSection items={faqItems} />

      {/* CTA fixo mobile */}
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
