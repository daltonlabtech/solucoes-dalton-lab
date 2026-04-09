// components/layout/Navbar.tsx
'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const links = [
  { href: '/sdr', label: 'SDR WhatsApp' },
  { href: '/propostas', label: 'Gerador de Propostas' },
  { href: '/crm', label: 'Transcrição + CRM' },
  { href: '/radar', label: 'Radar' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-dalton-bg/80 backdrop-blur-lg">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between" role="navigation" aria-label="Navegação principal">
        <Link href="/" className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-dalton-cyan rounded">
          <span className="text-xl font-black text-white tracking-tight">
            Dalton <span className="gradient-text">Lab</span>
          </span>
        </Link>

        {/* Desktop */}
        <ul className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <li key={l.href}>
              <Link href={l.href} className="text-sm text-dalton-gray-light hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:text-dalton-cyan">
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
          className="md:hidden text-dalton-gray-light hover:text-white p-2 rounded focus-visible:ring-2 focus-visible:ring-dalton-cyan"
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
                  className="text-dalton-gray-light hover:text-white transition-colors block py-1"
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
