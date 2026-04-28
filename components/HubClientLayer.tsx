'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { posthog } from '@/lib/posthog'
import { EarlyAccessPopup } from '@/components/EarlyAccessPopup'

const POPUP_PRODUCTS = {
  sdr: {
    productLabel: 'SDR WhatsApp',
    headline: 'Lead sem resposta é venda perdida.',
    body: 'Seu WhatsApp atendendo 24h — mesmo quando você não está.',
  },
  propostas: {
    productLabel: 'Gerador de Propostas',
    headline: 'Ainda monta proposta no PowerPoint?',
    body: 'Do CRM para o PDF em menos de 1 minuto.',
  },
  crm: {
    productLabel: 'Reunião + CRM',
    headline: 'Saiu da call. O CRM ficou vazio.',
    body: 'Cada reunião vira resumo e tarefa no CRM automaticamente — sem digitar nada.',
  },
} as const

type ProductKey = keyof typeof POPUP_PRODUCTS

interface ComingSoonProduct {
  href: string
  name: string
  tagline: string
  painStat: string
  cta: string
}

function HubClientLayerInner({ products }: { products: ComingSoonProduct[] }) {
  const searchParams = useSearchParams()
  const [openProduct, setOpenProduct] = useState<ProductKey | null>(null)
  const [isPopupVariant, setIsPopupVariant] = useState(false)

  useEffect(() => {
    posthog.onFeatureFlags(() => {
      const flag = posthog.getFeatureFlag('ab_waitlist_popup_v1')
      const isPopup = flag === 'popup'
      setIsPopupVariant(isPopup)

      if (isPopup) {
        const param = searchParams.get('produto') as ProductKey | null
        if (param && param in POPUP_PRODUCTS) {
          setOpenProduct(param)
        }
      }
    })
  }, [searchParams])

  const activeProduct = openProduct ? POPUP_PRODUCTS[openProduct] : null

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map(p => {
          const productKey = p.href.replace('/', '') as ProductKey
          return (
            <article
              key={p.href}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-dalton-cyan/30 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-black text-white">{p.name}</h3>
                <span className="text-xs font-bold uppercase tracking-widest text-dalton-cyan bg-dalton-cyan/10 border border-dalton-cyan/25 px-2.5 py-1 rounded-full whitespace-nowrap">
                  Acesso antecipado
                </span>
              </div>
              <p className="text-slate-200 text-sm leading-relaxed">{p.tagline}</p>
              <p className="text-xs text-slate-300 italic border-l-2 border-dalton-cyan/40 pl-3 leading-relaxed">
                {p.painStat}
              </p>
              <div className="flex items-center justify-between mt-auto pt-2">
                {isPopupVariant ? (
                  <button
                    onClick={() => setOpenProduct(productKey)}
                    className="inline-flex items-center gap-1.5 text-dalton-cyan text-sm font-semibold hover:gap-2.5 transition-all duration-150 focus-visible:outline-none focus-visible:underline"
                  >
                    {p.cta} <ArrowRight size={14} aria-hidden="true" />
                  </button>
                ) : (
                  <Link
                    href={p.href}
                    className="inline-flex items-center gap-1.5 text-dalton-cyan text-sm font-semibold hover:gap-2.5 transition-all duration-150 focus-visible:outline-none focus-visible:underline"
                  >
                    {p.cta} <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {activeProduct && openProduct && (
        <EarlyAccessPopup
          isOpen
          onClose={() => setOpenProduct(null)}
          product={openProduct}
          productLabel={activeProduct.productLabel}
          headline={activeProduct.headline}
          body={activeProduct.body}
        />
      )}
    </>
  )
}

export function HubClientLayer({ products }: { products: ComingSoonProduct[] }) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map(p => (
            <article key={p.href} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3">
              <h3 className="text-base font-black text-white">{p.name}</h3>
              <p className="text-slate-200 text-sm leading-relaxed">{p.tagline}</p>
            </article>
          ))}
        </div>
      }
    >
      <HubClientLayerInner products={products} />
    </Suspense>
  )
}
