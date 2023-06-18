import { type Config } from 'tailwindcss';
const { blackA, violet } = require('@radix-ui/colors');

export default {
  content: [
    './node_modules/flowbite-react/**/*.js',
    './src/**/*.{js,ts,jsx,tsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
} satisfies Config;
