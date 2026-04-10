// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dalton: {
          bg: '#0a1628',
          'bg-card': 'rgba(255,255,255,0.03)',
          cyan: '#7C3AED',
          orange: '#7C3AED',
          amber: '#D97706',
          white: '#ffffff',
          'gray-light': '#94a3b8',
          'gray-mid': '#64748b',
          'gray-dark': '#334155',
          'text-body': '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-cyan-purple': 'linear-gradient(135deg, #7C3AED, #00FFFF)',
        'gradient-glow': 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
      },
      borderRadius: {
        DEFAULT: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
}

export default config
