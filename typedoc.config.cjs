/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
  entryPoints: ['./src'],
  entryPointStrategy: 'expand',
  out: 'docs',
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
};
