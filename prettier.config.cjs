/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve('prettier-plugin-tailwindcss')],
  trailingComma: 'es5',
  tabWidth: 4,
  semi: true,
  singleQuote: true,
  insertPragma: false,
};

module.exports = config;
