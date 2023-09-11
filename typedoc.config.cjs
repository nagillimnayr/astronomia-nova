/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  name: 'Astronomia Nova',
  entryPoints: ['./src/'],
  entryPointStrategy: 'Expand',
  readme: './README.md',
  out: './src/pages/docs',
  tsconfig: 'tsconfig.json',
  compilerOptions: {
    tsx: 'react',
    noEmit: true,
    importHelpers: 'true',
  },
  exclude: [
    '**/*.js',
    '**/*.json',
    '**/*.mjs',
    '**/*.cjs',
    '**/*.stories.*',
    '**/stories/**',
    '**/*.typegen.*',
    '**/*.d.ts',
    '/src/type-declarations',
    '/src/helpers/react-spring-utils',
  ],
  plugin: [
    'typedoc-plugin-markdown',
    'typedoc-plugin-extras',
    'typedoc-plugin-zod',
  ],
  hideInPageTOC: true,
};
