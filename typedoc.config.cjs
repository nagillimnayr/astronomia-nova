/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  name: 'Astronomia Nova',
  entryPoints: [
    './src/components/canvas/body/',
    './src/components/canvas/orbit/',
  ],
  entryPointStrategy: 'Resolve',
  readme: './README.md',
  out: './src/pages/info/docs/',
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
    'typedoc-plugin-extras',
    'typedoc-plugin-zod',
    'typedoc-plugin-mdn-links',
    'typedoc-plugin-markdown',
  ],
  hideInPageTOC: true,
  categoryOrder: ['Props', 'Components', 'Classes', '*'],
};
