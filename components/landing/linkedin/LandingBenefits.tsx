const benefits = [
  {
    title: 'Post pronto em até 2 minutos',
    description: 'Descreva o tema, revise o rascunho e publique. Sem bloqueio criativo, sem fim de semana perdido.',
  },
  {
    title: 'Com imagem gerada por IA ou sua própria foto',
    description: 'Cada post sai com visual coerente — escolha entre imagem gerada pela IA ou use a sua.',
  },
  {
    title: 'Publica direto no LinkedIn com um clique',
    description: 'Integração nativa: do rascunho ao feed sem copiar, colar ou abrir outra aba.',
  },
];

export default function LandingBenefits() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94A3B8] mb-14">
          Por que usar
        </p>
        <div>
          {benefits.map((b, i) => (
            <div
              key={b.title}
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
                <p className="font-semibold text-[#0F172A] text-lg mb-1.5 leading-snug">
                  {b.title}
                </p>
                <p className="text-[#64748B] leading-relaxed text-base">
                  {b.description}
                </p>
              </div>
            </div>
          ))}
          <div className="border-t border-[#F1F5F9]" />
        </div>
      </div>
    </section>
  );
}
