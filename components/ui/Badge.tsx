// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn('inline-block text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full', className)}
      style={{
        color: 'var(--lp-accent)',
        border: '1px solid color-mix(in srgb, var(--lp-accent) 30%, transparent)',
        background: 'color-mix(in srgb, var(--lp-accent) 5%, transparent)',
      }}
    >
      {children}
    </span>
  )
}
