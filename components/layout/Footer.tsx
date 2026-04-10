// components/layout/Footer.tsx
import Link from 'next/link'
import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-dalton-bg border-t border-white/5 py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <Image
          src="/logo.png"
          alt="Dalton Lab"
          width={182}
          height={38}
          className="w-36 h-auto"
        />
        <p className="text-slate-400 text-sm">
          © {new Date().getFullYear()} Dalton Lab. Todos os direitos reservados.
        </p>
        <div className="flex gap-6 text-sm text-slate-400">
          <Link href="/" className="hover:text-dalton-cyan transition-colors">Soluções</Link>
          <a href="mailto:contato@daltonlab.ai" className="hover:text-dalton-cyan transition-colors">Contato</a>
        </div>
      </div>
    </footer>
  )
}
