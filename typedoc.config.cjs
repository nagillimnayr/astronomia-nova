/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: [
    './src/helpers/horizons/index.ts',
    './src/helpers/physics/index.ts',
  ],
  entryPointStrategy: 'Expand',
  out: './src/pages/info/docs',
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
