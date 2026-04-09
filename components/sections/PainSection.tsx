// components/sections/PainSection.tsx
interface Stat {
  value: string
  label: string
}

interface PainSectionProps {
  title: string
  body: string[]
  stats: Stat[]
}

export function PainSection({ title, body, stats }: PainSectionProps) {
  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="divider-glow mb-16" />

        <h2 className="text-3xl md:text-4xl font-black text-white mb-8 leading-tight">
          {title}
        </h2>

        <div className="highlight-box mb-12">
          {body.map((para, i) => (
            <p key={i} className="text-dalton-text-body text-lg leading-relaxed mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center border-t-2 border-dalton-cyan/30">
              <p className="text-2xl font-black gradient-text mb-2">{stat.value}</p>
              <p className="text-dalton-gray-light text-sm leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
