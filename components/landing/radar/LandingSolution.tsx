const solutions = [
  {
    benefit: 'Todas as métricas num lugar',
    feature: 'Views, alcance, ER%, saves e compartilhamentos — sem precisar abrir o Instagram.',
  },
  {
    benefit: 'Relatório pronto em segundos',
    feature: 'Performance do mês gerada automaticamente. Pronto para apresentar ao cliente.',
  },
  {
    benefit: 'IA identifica o que funcionou',
    feature: 'Quais hooks performam, quais formatos engajam — e por quê.',
  },
];

export default function LandingSolution() {
  return (
    <section className="py-20 px-6" style={{ background: '#F8FAFC' }}>
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94A3B8] mb-6">
          O Radar
        </p>
        <p className="text-[#0F172A] text-lg mb-12 max-w-xl leading-relaxed">
          Detecta o que funciona antes de você desperdiçar mais um post.
        </p>
        <div>
          {solutions.map((s, i) => (
            <div
              key={i}
              className="py-10 border-t border-[#E2E8F0] grid gap-6"
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
                  {s.benefit}
                </p>
                <p className="text-[#64748B] text-base leading-relaxed">{s.feature}</p>
              </div>
            </div>
          ))}
          <div className="border-t border-[#E2E8F0]" />
        </div>
      </div>
    </section>
  );
}
