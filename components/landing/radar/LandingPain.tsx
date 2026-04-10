const pains = [
  {
    title: 'Não sabe qual formato funciona',
    description: 'Posta Reels, Carrossel, Story — sem saber qual traz mais resultado para o seu perfil.',
  },
  {
    title: 'Perde horas nos números do Instagram',
    description: 'Precisa entrar no Meta Business Suite, copiar dados, montar planilha. Toda semana.',
  },
  {
    title: 'Toma decisão de pauta no achismo',
    description: 'Sem dados, você repete o que acha que funcionou — não o que os números provam.',
  },
];

export default function LandingPain() {
  return (
    <section className="bg-white py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#94A3B8] mb-14">
          O problema
        </p>
        <div>
          {pains.map((pain, i) => (
            <div
              key={pain.title}
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
                  {pain.title}
                </p>
                <p className="text-[#64748B] leading-relaxed text-base">
                  {pain.description}
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
