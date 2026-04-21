import { Plus_Jakarta_Sans } from 'next/font/google'

const font = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700', '800'],
})

export default function PreviewAdsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={font.className}
      style={{ position: 'fixed', inset: 0, overflow: 'auto', zIndex: 50, background: '#0a1628' }}
    >
      {children}
    </div>
  )
}
