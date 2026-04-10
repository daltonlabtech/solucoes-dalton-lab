// components/sections/SolutionSection.tsx
interface Step {
  number: string
  title: string
  description: string
}

interface SolutionSectionProps {
  title: string
  steps: Step[]
  closing?: string
}

export function SolutionSection({ title, steps, closing }: SolutionSectionProps) {
  return (
    <section className="py-20 px-6 bg-white/[0.01]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-12 leading-tight">
          {title}
        </h2>

        <div className="flex flex-col gap-6">
          {steps.map((step, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: 'color-mix(in srgb, var(--lp-accent) 10%, transparent)',
                  border: '1px solid color-mix(in srgb, var(--lp-accent) 30%, transparent)',
                }}
              >
                <span className="gradient-text font-black text-lg">{step.number}</span>
              </div>
              <div className="glass-card flex-1 p-6">
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-dalton-gray-light leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {closing && (
          <div className="mt-10 highlight-box">
            <p className="text-dalton-text-body text-lg italic leading-relaxed">{closing}</p>
          </div>
        )}
      </div>
    </section>
  )
}
