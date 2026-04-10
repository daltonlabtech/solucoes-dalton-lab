// components/WaitlistModal.tsx
'use client'
import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { posthog } from '@/lib/posthog'

interface WaitlistModalProps {
  isOpen: boolean
  onClose: () => void
  product: string
  productLabel: string
  price?: string
  modalTitle?: string
  ctaLabel?: string
}

type PriceAnswer = 'sim' | 'conversa' | 'nao' | ''

export function WaitlistModal({ isOpen, onClose, product, productLabel, price = 'R$ 297/mês', modalTitle = 'Garantir meu lugar', ctaLabel = 'Garantir meu lugar →' }: WaitlistModalProps) {
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [priceAnswer, setPriceAnswer] = useState<PriceAnswer>('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const firstInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!priceAnswer) { setError('Responda a pergunta sobre o preço.'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, whatsapp, empresa, price_answer: priceAnswer, product }),
      })

      if (!res.ok) throw new Error('Erro ao enviar')

      posthog.capture('waitlist_signup', { product, price_answer: priceAnswer })
      setSuccess(true)
    } catch {
      setError('Algo deu errado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-dalton-gray-mid focus:outline-none focus:border-dalton-cyan/50 transition-colors'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      {/* Scrim */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-md glass-card p-8 shadow-2xl border border-dalton-cyan/20">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-dalton-gray-mid hover:text-white transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-dalton-cyan"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="text-4xl mb-4 gradient-text font-black">✓</div>
            <h2 className="text-2xl font-bold text-white mb-3">Tudo certo!</h2>
            <p className="text-dalton-gray-light">
              Perfeito! Você está entre os primeiros a testar o <strong className="text-white">{productLabel}</strong>. A gente entra em contato com acesso antes do lançamento público.
            </p>
            <button onClick={onClose} className="mt-6 text-dalton-cyan text-sm underline">Fechar</button>
          </div>
        ) : (
          <>
            <h2 id="modal-title" className="text-xl font-bold text-white mb-1">
              {modalTitle}
            </h2>
            <p className="text-dalton-gray-light text-sm mb-6">
              {productLabel} · {price} · Cancele quando quiser
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor="nome" className="text-sm text-dalton-gray-light mb-1 block">
                  Nome <span aria-hidden="true" className="text-dalton-cyan">*</span>
                </label>
                <input
                  ref={firstInputRef}
                  id="nome"
                  type="text"
                  required
                  autoComplete="name"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  className={inputClass}
                  placeholder="Seu nome"
                />
              </div>

              <div>
                <label htmlFor="whatsapp" className="text-sm text-dalton-gray-light mb-1 block">
                  WhatsApp <span aria-hidden="true" className="text-dalton-cyan">*</span>
                </label>
                <input
                  id="whatsapp"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  className={inputClass}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label htmlFor="empresa" className="text-sm text-dalton-gray-light mb-1 block">
                  Empresa <span aria-hidden="true" className="text-dalton-cyan">*</span>
                </label>
                <input
                  id="empresa"
                  type="text"
                  required
                  autoComplete="organization"
                  value={empresa}
                  onChange={e => setEmpresa(e.target.value)}
                  className={inputClass}
                  placeholder="Nome da sua empresa"
                />
              </div>

              <div>
                <p className="text-sm text-dalton-gray-light mb-2">
                  Esse preço faz sentido para o seu negócio agora?
                </p>
                <div className="flex flex-col gap-2" role="radiogroup" aria-required="true">
                  {[
                    { value: 'sim', label: 'Sim, faz sentido' },
                    { value: 'conversa', label: 'Precisa de conversa' },
                    { value: 'nao', label: 'Ainda não' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${priceAnswer === opt.value ? 'border-dalton-cyan/50 bg-dalton-cyan/10 text-white' : 'border-white/10 text-dalton-gray-light hover:border-white/20'}`}>
                      <input
                        type="radio"
                        name="price_answer"
                        value={opt.value}
                        checked={priceAnswer === opt.value}
                        onChange={() => setPriceAnswer(opt.value as PriceAnswer)}
                        className="sr-only"
                      />
                      <span className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${priceAnswer === opt.value ? 'border-dalton-cyan' : 'border-white/30'}`}>
                        {priceAnswer === opt.value && <span className="w-2 h-2 rounded-full bg-dalton-cyan" />}
                      </span>
                      <span className="text-sm">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <p role="alert" className="text-red-400 text-sm">{error}</p>
              )}

              <Button type="submit" loading={loading} size="lg" className="w-full mt-2">
                {ctaLabel}
              </Button>

              <p className="text-xs text-dalton-gray-mid text-center">
                Sem spam. A gente só avisa no lançamento.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
