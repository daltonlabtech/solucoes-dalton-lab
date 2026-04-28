'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { posthog, AB_WAITLIST_FLAG } from '@/lib/posthog'

const waitlistLinks = [
  { href: '/sdr', popup: '/?produto=sdr', label: 'SDR WhatsApp' },
  { href: '/propostas', popup: '/?produto=propostas', label: 'Gerador de Propostas' },
  { href: '/crm', popup: '/?produto=crm', label: 'Reuniões → CRM' },
]

const staticLinks = [
  { href: '/radar', label: 'Radar' },
  { href: '/linkedin', label: 'Linkedin Post' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [isPopupVariant, setIsPopupVariant] = useState(false)

  useEffect(() => {
    const unsubscribe = posthog.onFeatureFlags(() => {
      setIsPopupVariant(posthog.getFeatureFlag(AB_WAITLIST_FLAG) === 'popup')
    })
    return () => unsubscribe?.()
  }, [])

  const links = [
    ...waitlistLinks.map(l => ({ href: isPopupVariant ? l.popup : l.href, label: l.label })),
    ...staticLinks,
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dalton-bg/80 backdrop-blur-lg">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" role="navigation" aria-label="Navegação principal">
        <Link href="/" className="flex items-center focus-visible:ring-2 focus-visible:ring-dalton-cyan rounded">
          <Image
            src="/logo.png"
            alt="Dalton Lab"
            width={182}
            height={38}
            className="w-40 h-auto"
            priority
          />
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-slate-300 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:text-dalton-cyan">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/" className="hidden md:block">
          <Button size="sm">Ver soluções</Button>
        </Link>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-2 rounded focus-visible:ring-2 focus-visible:ring-dalton-cyan"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-dalton-bg px-6 py-4">
          <ul className="flex flex-col gap-4">
            {links.map(l => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-slate-300 hover:text-white transition-colors block py-1"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
