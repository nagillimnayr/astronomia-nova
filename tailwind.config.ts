import { type Config } from 'tailwindcss';
import { blackA, violet } from '@radix-ui/colors';

export default {
  content: [
    './node_modules/flowbite-react/**/*.js',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        ...blackA,
        ...violet,
      },
    },
  },
  plugins: [require('flowbite/plugin'), require('@tailwindcss/typography'), require('@tailwindcss/container-queries') ],
} satisfies Config;
