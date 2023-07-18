/** @type {import('tailwindcss').Config} */
import { type Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';
import { addDynamicIconSelectors } from '@iconify/tailwind';

export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,md,mdx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{js,ts,jsx,tsx,md,mdx}',
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-orbitron)'],
        orbitron: ['var(--font-orbitron)'],
        atomicAge: ['var(--font-atomic-age)'],
      },
      colors: {
        background: {
          DEFAULT: 'var(--background)',
        },
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        subtle: {
          DEFAULT: 'var(--subtle)',
          foreground: 'var(--subtle-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        border: 'var(--border) ',
        input: 'var(--input)',
        ring: 'var(--ring)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: '100%' },
        },
        'collapsible-up': {
          from: { height: '100%' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.5s ease-out',
        'collapsible-up': 'collapsible-up 0.5s ease-out',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-headings': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-lead': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-links': 'colors.sky[900]',
            '--tw-prose-bold': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-counters': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-bullets': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-hr': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-quotes': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-quote-borders':
              'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-captions': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-code': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-pre-code': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-pre-bg': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-th-borders': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-td-borders': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-invert-body': 'hsl(var(--foreground) / <alpha-value>)',
            '--tw-prose-invert-headings':
              'hsl(var(--foreground) / <alpha-value>)',
          },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('@headlessui/tailwindcss'),
    addDynamicIconSelectors(),
  ],
} satisfies Config;
