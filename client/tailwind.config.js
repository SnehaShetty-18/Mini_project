/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'var(--color-border)', // slate-200
        input: 'var(--color-input)', // slate-100
        ring: 'var(--color-ring)', // blue-600
        background: 'var(--color-background)', // gray-50
        foreground: 'var(--color-foreground)', // slate-800
        primary: {
          DEFAULT: 'var(--color-primary)', // blue-600
          foreground: 'var(--color-primary-foreground)', // white
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)', // blue-700
          foreground: 'var(--color-secondary-foreground)', // white
        },
        destructive: {
          DEFAULT: 'var(--color-destructive)', // red-600
          foreground: 'var(--color-destructive-foreground)', // white
        },
        muted: {
          DEFAULT: 'var(--color-muted)', // slate-100
          foreground: 'var(--color-muted-foreground)', // slate-500
        },
        accent: {
          DEFAULT: 'var(--color-accent)', // emerald-500
          foreground: 'var(--color-accent-foreground)', // white
        },
        popover: {
          DEFAULT: 'var(--color-popover)', // white
          foreground: 'var(--color-popover-foreground)', // slate-800
        },
        card: {
          DEFAULT: 'var(--color-card)', // white
          foreground: 'var(--color-card-foreground)', // slate-800
        },
        success: {
          DEFAULT: 'var(--color-success)', // emerald-600
          foreground: 'var(--color-success-foreground)', // white
        },
        warning: {
          DEFAULT: 'var(--color-warning)', // amber-600
          foreground: 'var(--color-warning-foreground)', // white
        },
        error: {
          DEFAULT: 'var(--color-error)', // red-600
          foreground: 'var(--color-error-foreground)', // white
        },
        // Brand specific colors
        'brand-primary': 'var(--color-brand-primary)', // indigo-600
        'brand-secondary': 'var(--color-brand-secondary)', // cyan-500
        'civic-authority': 'var(--color-civic-authority)', // indigo-500
        'surface': 'var(--color-surface)', // slate-100
        'text-secondary': 'var(--color-text-secondary)', // slate-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      fontSize: {
        'civic-hero': ['48px', { lineHeight: '1.1', fontWeight: '700' }],
        'civic-title': ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        'civic-subtitle': ['24px', { lineHeight: '1.3', fontWeight: '500' }],
        'civic-body': ['16px', { lineHeight: '1.5', fontWeight: '400' }],
        'civic-caption': ['14px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        'civic-xs': '12px',
        'civic-sm': '16px',
        'civic-md': '24px',
        'civic-lg': '32px',
        'civic-xl': '48px',
      },
      borderRadius: {
        'civic': '8px',
        'civic-lg': '12px',
        'civic-xl': '16px',
      },
      boxShadow: {
        'civic': '0 4px 12px rgba(79, 70, 229, 0.08)',
        'civic-lg': '0 10px 25px rgba(0, 0, 0, 0.15)',
        'civic-hover': '0 8px 16px rgba(79, 70, 229, 0.15)',
      },
      animation: {
        'civic-fade-in': 'civicFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        'civic-slide-up': 'civicSlideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'civic-pulse': 'civicPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        civicFadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        civicSlideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        civicPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
      transitionTimingFunction: {
        'civic': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}