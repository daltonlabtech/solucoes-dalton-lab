const stats = [
  { value: '+3 milhões', label: 'de visualizações rastreadas' },
  { value: '738', label: 'posts analisados pela IA' },
  { value: '37', label: 'relatórios gerados' },
];

export default function LandingProof() {
  return (
    <section style={{ background: '#0C0C0E' }} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-white/55 mb-14">
          Números reais
        </p>

        {/* Stats em tipografia grande */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-[#F59E0B] pl-6">
              <p
                style={{ fontFamily: 'var(--font-display)' }}
                className="text-5xl md:text-6xl text-white leading-none mb-2"
              >
                {stat.value}
              </p>
              <p className="text-white/55 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Before / After */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="p-8 md:p-10" style={{ background: '#111113', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-[#F59E0B] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Antes
            </p>
            <p className="text-white/60 leading-relaxed text-base">
              2 horas por semana puxando dados do Instagram e TikTok, copiando para uma IA e montando o relatório na mão.
            </p>
          </div>
          <div className="p-8 md:p-10" style={{ background: '#111113' }}>
            <p className="text-[#F59E0B] text-xs font-semibold tracking-[0.2em] uppercase mb-5">
              Depois
            </p>
            <p
              style={{ fontFamily: 'var(--font-display)' }}
              className="text-white text-2xl leading-snug mb-6"
            >
              Relatório completo de 738 posts — gerado em segundos.
            </p>
            <p className="text-white/45 text-xs">— Uso interno Dalton Lab</p>
          </div>
        </div>
      </div>
    </section>
  );
}
