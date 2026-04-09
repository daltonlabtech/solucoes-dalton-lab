// components/layout/Footer.tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-10 mt-20">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-xl font-black text-white">
          Dalton <span className="gradient-text">Lab</span>
        </span>
        <p className="text-dalton-gray-mid text-sm">
          © {new Date().getFullYear()} Dalton Lab. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-sm text-dalton-gray-mid">
          <Link href="/" className="hover:text-dalton-cyan transition-colors">Soluções</Link>
          <a href="mailto:contato@daltonlab.ai" className="hover:text-dalton-cyan transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  )
}
