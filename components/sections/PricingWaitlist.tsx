// components/sections/PricingWaitlist.tsx
import { Button } from '@/components/ui/Button'
import { Check } from 'lucide-react'

interface PricingRow {
  label: string
  value: string
}

interface PricingWaitlistProps {
  rows: PricingRow[]
  onCTA: () => void
}

export function PricingWaitlist({ rows, onCTA }: PricingWaitlistProps) {
  return (
    <section className="py-20 px-6 bg-white/[0.01]">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 text-center leading-tight">
          Seja um dos primeiros a testar.
        </h2>
        <p className="text-dalton-gray-light text-center mb-10 text-lg">
          Estamos abrindo vagas para os primeiros clientes — com acompanhamento direto do time da Dalton Lab.
        </p>

        <div className="glass-card border border-dalton-cyan/20 overflow-hidden">
          <table className="w-full" role="table">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="px-6 py-4 text-dalton-gray-light text-sm">{row.label}</td>
                  <td className="px-6 py-4 text-white font-semibold text-sm text-right">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col items-center mt-8 gap-3">
          <Button size="lg" onClick={onCTA} className="w-full max-w-sm">
            Garantir meu lugar →
          </Button>
          <div className="flex items-center gap-2 text-dalton-gray-mid text-sm">
            <Check size={14} className="text-dalton-cyan flex-shrink-0" />
            Sem contrato anual. Cancele quando quiser.
          </div>
        </div>
      </div>
    </section>
  )
}
