// components/sections/FAQSection.tsx
'use client'
import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

export function FAQSection({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-white mb-10 text-center">Perguntas frequentes</h2>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4 focus-visible:ring-2 focus-visible:ring-dalton-cyan focus-visible:ring-inset"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                aria-controls={`faq-answer-${i}`}
              >
                <span className="text-white font-semibold leading-snug">{item.question}</span>
                <ChevronDown
                  size={18}
                  className={`flex-shrink-0 text-dalton-cyan transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>
              <div
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-btn-${i}`}
                hidden={open !== i}
                className="px-6 pb-5"
              >
                <p className="text-dalton-gray-light leading-relaxed">{item.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
