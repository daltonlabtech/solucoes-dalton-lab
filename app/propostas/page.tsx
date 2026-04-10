// app/propostas/page.tsx
'use client'
import { useState } from 'react'
import { HeroLP } from '@/components/sections/HeroLP'
import { PainSection } from '@/components/sections/PainSection'
import { SolutionSection } from '@/components/sections/SolutionSection'
import { PricingWaitlist } from '@/components/sections/PricingWaitlist'
import { FAQSection } from '@/components/sections/FAQSection'
import { WaitlistModal } from '@/components/WaitlistModal'
import { Button } from '@/components/ui/Button'

const PRODUCT = 'propostas'
const PRODUCT_LABEL = 'Gerador de Propostas'

const faqItems = [
  {
    question: 'Posso usar o meu próprio template de proposta?',
    answer: 'Sim. Você sobe o template da sua empresa (PPT ou Word) e o sistema preenche nos campos que você definir. O visual continua sendo o seu.',
  },
  {
    question: 'Quanto tempo leva para configurar?',
    answer: 'Em média 30 minutos. Você sobe o template uma vez, define os campos e está pronto. O time acompanha no onboarding.',
  },
  {
    question: 'Preciso ter um CRM para usar?',
    answer: 'Não. Você preenche os dados do lead direto na plataforma — nome, empresa, produto, valor. Sem integração necessária.',
  },
  {
    question: 'Quais campos posso incluir na proposta?',
    answer: 'Qualquer campo que já esteja no seu template. Você define o mapeamento uma vez e o sistema preenche automaticamente a cada nova proposta.',
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

const validationQuotes = [
  {
    quote: 'Meu vendedor passa mais tempo formatando proposta do que em reunião.',
    author: 'Gestor comercial, empresa de eventos',
  },
  {
    quote: 'Já perdi cliente porque a proposta demorou. O concorrente foi mais rápido.',
    author: 'Diretor de operações, empresa de tecnologia',
  },
  {
    quote: 'Template atualizado fica em pendência semanas. Ninguém sabe qual versão usar.',
    author: 'CEO, empresa de serviços B2B',
  },
]

export default function GeradorPropostasPage() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <>
      <HeroLP
        badge="Gerador de Propostas"
        headline="Proposta pronta em 1 minuto — sem abrir o PowerPoint."
        subheadline="Você preenche os dados do lead, o sistema monta a proposta no seu template e entrega pronta para enviar. Sem copiar e colar. Sem formatar nada."
        ctaLabel="Quero acesso antecipado →"
        onCTA={() => setModalOpen(true)}
      />

      <PainSection
        title="41 horas por semana montando proposta não é processo — é desperdício."
        body={[
          'Uma equipe de 5 vendedores que leva 10 minutos por proposta e manda 250 por mês gasta 41 horas coletivas só nisso. Horas que deveriam estar em reunião, em follow-up, em fechar.',
          'E no final, o cliente abre o PDF, vê que tem erro de digitação ou dado errado, e a credibilidade vai junto.',
        ]}
        stats={[
          { value: '250', label: 'propostas/mês numa equipe de 5 vendedores (caso real: empresa de eventos)' },
          { value: '41h', label: 'por semana perdidas em trabalho que uma máquina faz' },
          { value: '100%', label: 'das equipes que entrevistamos montavam proposta no PowerPoint — manualmente' },
        ]}
      />

      <SolutionSection
        title="Do lead aprovado à proposta enviada — sem abrir o PowerPoint."
        steps={[
          {
            number: '1',
            title: 'Preenche os dados do lead',
            description: 'Nome, empresa, produto de interesse, valor — você informa direto na plataforma. Sem integração, sem configuração complexa.',
          },
          {
            number: '2',
            title: 'Gera no seu template — sem alterar nada',
            description: 'Você define o template uma vez. O sistema preenche, formata e gera o PDF ou PPTX com os dados certos.',
          },
          {
            number: '3',
            title: 'Baixa e envia pro cliente',
            description: 'A proposta sai pronta no visual da sua empresa. Você baixa ou manda direto pela plataforma — como preferir.',
          },
        ]}
        closing="Sem copiar e colar. Sem erros de digitação. Sem esperar o assistente ter tempo."
      />

      {/* Validação com PMEs reais */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="divider-glow mb-16" />

          <h2 className="text-3xl md:text-4xl font-black text-white mb-3 leading-tight">
            O que ouvimos de quem tem essa dor
          </h2>
          <p className="text-dalton-gray-light text-lg mb-10">
            Conversamos com gestores comerciais de PMEs em diferentes setores.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {validationQuotes.map((item, i) => (
              <div key={i} className="glass-card p-6 flex flex-col gap-4">
                <p className="text-dalton-text-body leading-relaxed italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <p className="text-dalton-gray-mid text-sm mt-auto">— {item.author}</p>
              </div>
            ))}
          </div>

          <p className="text-dalton-gray-mid text-xs mt-8 text-center">
            Relatos de entrevistas com participantes do programa de validação Dalton Lab.
          </p>
        </div>
      </section>

      <PricingWaitlist
        rows={pricingRows}
        onCTA={() => setModalOpen(true)}
        ctaLabel="Quero acesso antecipado →"
      />

      <FAQSection items={faqItems} />

      <div className="fixed bottom-0 left-0 right-0 md:hidden p-4 bg-dalton-bg/90 backdrop-blur border-t border-white/5 z-40">
        <Button size="lg" onClick={() => setModalOpen(true)} className="w-full">
          Quero acesso antecipado →
        </Button>
      </div>

      <WaitlistModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        product={PRODUCT}
        productLabel={PRODUCT_LABEL}
        modalTitle="Entrar na lista de espera"
        ctaLabel="Confirmar minha vaga →"
      />
    </>
  )
}
