const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    '@unocss/postcss': {
      // Optional
      content: ['**/*.{html,js,ts,jsx,tsx}'],
    },
  },
};

module.exports = config;
