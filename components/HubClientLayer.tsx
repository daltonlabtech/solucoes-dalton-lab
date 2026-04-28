'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { posthog, AB_WAITLIST_FLAG } from '@/lib/posthog'
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
    const unsubscribe = posthog.onFeatureFlags(() => {
      const flag = posthog.getFeatureFlag(AB_WAITLIST_FLAG)
      const isPopup = flag === 'popup'
      setIsPopupVariant(isPopup)

      if (isPopup) {
        const param = searchParams.get('produto') as ProductKey | null
        if (param && param in POPUP_PRODUCTS) {
          setOpenProduct(param)
        }
      }
    })
    return () => unsubscribe?.()
  }, [searchParams])

  const activeProduct = openProduct ? POPUP_PRODUCTS[openProduct] : null

  return (
    <>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth -mx-6 px-6 pr-6 pb-2 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:overflow-visible">
        {products.map(p => {
          const productKey = p.href.replace('/', '') as ProductKey
          const cardContent = (
            <article className="relative bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:border-dalton-cyan/30 transition-all duration-200 cursor-pointer h-full">
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
              <div className="flex items-center mt-auto pt-2">
                <span className="inline-flex items-center gap-1.5 text-dalton-cyan text-sm font-semibold">
                  {p.cta} <ArrowRight size={14} aria-hidden="true" />
                </span>
              </div>
            </article>
          )

          return (
            <div
              key={p.href}
              className="flex-shrink-0 w-[78vw] snap-start md:w-auto md:flex-shrink md:snap-align-none"
            >
              {isPopupVariant ? (
                <button
                  onClick={() => setOpenProduct(productKey)}
                  className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalton-cyan rounded-2xl h-full"
                  aria-label={`${p.cta} — ${p.name}`}
                >
                  {cardContent}
                </button>
              ) : (
                <Link
                  href={p.href}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dalton-cyan rounded-2xl h-full"
                  aria-label={`${p.cta} — ${p.name}`}
                >
                  {cardContent}
                </Link>
              )}
            </div>
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
        <div className="flex gap-4 overflow-x-auto -mx-6 px-6 pb-2 md:mx-0 md:px-0 md:pb-0 md:grid md:grid-cols-3 md:overflow-visible">
          {products.map(p => (
            <div key={p.href} className="flex-shrink-0 w-[78vw] md:w-auto md:flex-shrink">
              <article className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 h-full">
                <h3 className="text-base font-black text-white">{p.name}</h3>
                <p className="text-slate-200 text-sm leading-relaxed">{p.tagline}</p>
              </article>
            </div>
          ))}
        </div>
      }
    >
      <HubClientLayerInner products={products} />
    </Suspense>
  )
}
