'use client'
import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { posthog } from '@/lib/posthog'

interface EarlyAccessPopupProps {
  isOpen: boolean
  onClose: () => void
  product: string
  productLabel: string
  headline: string
  body: string
}

function formatWhatsApp(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 2) return digits.length ? `(${digits}` : ''
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function EarlyAccessPopup({ isOpen, onClose, product, productLabel, headline, body }: EarlyAccessPopupProps) {
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
      posthog.capture('waitlist_modal_opened', {
        product,
        variant: 'popup',
        source_page: window.location.pathname,
      })
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, product])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function handleClose() {
    if (!success) {
      posthog.capture('waitlist_modal_abandoned', {
        product,
        variant: 'popup',
        source_page: window.location.pathname,
      })
    }
    onClose()
  }

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const digits = whatsapp.replace(/\D/g, '')
    if (digits.length < 10) { setError('Informe um WhatsApp válido.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ whatsapp, product, variant: 'popup' }),
      })
      if (!res.ok) throw new Error()
      posthog.capture('waitlist_signup', {
        product,
        variant: 'popup',
        source_page: window.location.pathname,
      })
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
      aria-labelledby="popup-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-sm glass-card p-8 shadow-2xl border border-dalton-cyan/20">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-dalton-gray-mid hover:text-white transition-colors p-1 rounded focus-visible:ring-2 focus-visible:ring-dalton-cyan"
          aria-label="Fechar"
        >
          <X size={20} />
        </button>

        {success ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-4 gradient-text font-black">✓</div>
            <h2 className="text-xl font-bold text-white mb-2">Tudo certo!</h2>
            <p className="text-dalton-gray-light text-sm">
              Você está entre os primeiros a testar o <strong className="text-white">{productLabel}</strong>. A gente entra em contato antes do lançamento público.
            </p>
            <button onClick={onClose} className="mt-5 text-dalton-cyan text-sm underline">
              Fechar
            </button>
          </div>
        ) : (
          <>
            <h2 id="popup-title" className="text-xl font-black text-white mb-2">
              {headline}
            </h2>
            <p className="text-dalton-gray-light text-sm mb-6">{body}</p>
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              <div>
                <label htmlFor="popup-whatsapp" className="text-sm text-dalton-gray-light mb-1 block">
                  Qual o seu WhatsApp?
                </label>
                <input
                  ref={inputRef}
                  id="popup-whatsapp"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="numeric"
                  value={whatsapp}
                  onChange={e => setWhatsapp(formatWhatsApp(e.target.value))}
                  className={inputClass}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {error && <p role="alert" className="text-red-400 text-sm">{error}</p>}
              <Button type="submit" loading={loading} size="lg" className="w-full">
                Quero acesso antecipado →
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
