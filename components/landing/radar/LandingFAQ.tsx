const faqs = [
  {
    q: 'Preciso dar acesso à senha do meu Instagram?',
    a: 'Não. Só informamos o @ do seu perfil público.',
  },
  {
    q: 'Funciona para perfil pessoal ou só business?',
    a: 'Funciona com qualquer @ público do Instagram.',
  },
  {
    q: 'Posso cancelar quando quiser?',
    a: 'Sim. Seu acesso permanece até o fim do ciclo já pago.',
  },
  {
    q: 'Em quanto tempo vejo os primeiros dados?',
    a: 'Os primeiros dados aparecem em até 24h após conectar o perfil.',
  },
  {
    q: 'Tem suporte?',
    a: 'Sim, via email em suporte@daltonlab.ai.',
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
