// components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, asChild, style: styleProp, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-dalton-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-dalton-bg disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'text-white hover:brightness-110 active:scale-[0.98]',
      secondary: 'border btn-secondary-hover active:scale-[0.98]',
      ghost: 'text-dalton-gray-light hover:text-white hover:bg-white/5',
    }

    const accentStyle =
      variant === 'primary'
        ? { backgroundColor: 'var(--lp-accent)' }
        : variant === 'secondary'
          ? {
              borderColor: 'color-mix(in srgb, var(--lp-accent) 40%, transparent)',
              color: 'var(--lp-accent)',
              backgroundColor: 'transparent',
            }
          : undefined

    const sizes = {
      sm: 'px-5 py-2.5 text-sm',
      md: 'px-7 py-3.5 text-base',
      lg: 'px-9 py-4 text-lg',
    }

    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        style={{ ...accentStyle, ...styleProp }}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Enviando...
          </span>
        ) : children}
      </Comp>
    )
  }
)
Button.displayName = 'Button'
