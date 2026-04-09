// components/ui/Badge.tsx
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-block text-xs font-bold uppercase tracking-[0.2em] text-dalton-cyan',
      'border border-dalton-cyan/30 px-5 py-2 rounded-full bg-dalton-cyan/5',
      className
    )}>
      {children}
    </span>
  )
}
