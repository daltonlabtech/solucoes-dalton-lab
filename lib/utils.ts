// lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const whatsappInputClass = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-dalton-gray-mid focus:outline-none focus:border-dalton-cyan/50 transition-colors'
