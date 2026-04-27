const faqs = [
  {
    q: 'O conteúdo vai parecer genérico?',
    a: 'Não. A IA é configurada com a identidade, mercado e tom de voz da sua empresa — cada post reflete a sua marca.',
  },
  {
    q: 'Preciso de conhecimento técnico para usar?',
    a: 'Não. É uma plataforma web simples: descreva o post, revise e publique.',
  },
  {
    q: 'O que acontece se acabar os 100 créditos?',
    a: 'Os créditos renovam todo mês. Planos com maior volume em breve.',
  },
];

export default function LandingFAQ() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p
          style={{ fontFamily: 'var(--font-mono)' }}
          className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94A3B8] mb-14"
        >
          Dúvidas
        </p>

        <div>
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="py-8 border-t border-[#F1F5F9] grid gap-6"
              style={{ gridTemplateColumns: '72px 1fr' }}
            >
              <span
                style={{ fontFamily: 'var(--font-mono)', color: '#E2E8F0', lineHeight: 1 }}
                className="text-4xl font-bold select-none tracking-tight"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="pt-1">
                <p
                  style={{ fontFamily: 'var(--font-display)' }}
                  className="text-[#0F172A] text-2xl mb-2 leading-snug"
                >
                  {faq.q}
                </p>
                <p className="text-[#64748B] text-base leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-[#F1F5F9]" />
        </div>
      </div>
    </section>
  );
}
