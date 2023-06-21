import { type Config } from 'tailwindcss';
import { blackA, violet } from '@radix-ui/colors';
import colors from 'tailwindcss/colors';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: [
    './node_modules/flowbite-react/**/*.js',
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-roboto)', ...defaultTheme.fontFamily.sans],
        display: ['var(--font-orbitron)'],
        orbitron: ['var(--font-orbitron)'],
        atomicAge: ['var(--font-atomic-age)'],
      },
      colors: {
        ...blackA,
        ...violet,
        outerSpace: {
          900: '#414A4C',
          800: '#4E595B',
          700: '#5A6769',
          600: '#667478',
          500: '#728286',
          400: '#808F92',
          300: '#8E9B9E',
          200: '#9CA8AB',
          100: '#AAB4B7',
        },
        spaceCadet: {
          900: '#1E2952',
          800: '#263467',
          700: '#2E3E7B',
          600: '#354990',
          500: '#3D53A5',
          400: '#455EBA',
          300: '#5970C2',
          200: '#6E82C9',
          100: '#8394D1',
        },
        jet: {
          900: '#343434',
          800: '#424242',
          700: '#505050',
          600: '#5F5F5F',
          500: '#6D6D6D',
          400: '#7C7C7C',
          300: '#8A8A8A',
          200: '#999999',
          100: '#A8A8A8',
        },
        onyx: {
          900: '#353839',
          800: '#434849',
          700: '#515658',
          600: '#5F6567',
          500: '#6C7375',
          400: '#7A8284',
          300: '#899092',
          200: '#989EA0',
          100: '#A6ABAD',
        },
        gunmetal: '#2A3439',
        richBlack: '#010B13',
        eerieBlack: '#1B1B1B',
        night: '#111111',
        raisinBlack: '#242124',
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/container-queries'),
    require('daisyui'),
  ],
  daisyui: {
    themes: false, // true: all themes | false: only light + dark | array: specific themes like this ["light", "dark", "cupcake"]
    darkTheme: 'dark', // name of one of the included themes for dark mode
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    rtl: false, // rotate style direction from left-to-right to right-to-left. You also need to add dir="rtl" to your html tag and install `tailwindcss-flip` plugin for Tailwind CSS.
    prefix: '', // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
  },
} satisfies Config;
