// components/sections/SocialProofPlaceholder.tsx
// Placeholder — substituir por caso âncora real antes de publicar
export function SocialProofPlaceholder() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="divider-glow mb-16" />
        <div className="glass-card p-10 text-center border border-dalton-cyan/10">
          <p className="text-dalton-gray-mid text-sm uppercase tracking-widest mb-4">Resultados reais</p>
          <blockquote className="text-2xl font-black text-white leading-snug mb-6">
            &quot;Caso âncora com resultado mensurável — em breve.&quot;
          </blockquote>
          <p className="text-dalton-gray-light text-sm">
            Estamos coletando os primeiros resultados dos beta testers.<br />
            Você pode ser um deles.
          </p>
        </div>
      </div>
    </section>
  )
}
