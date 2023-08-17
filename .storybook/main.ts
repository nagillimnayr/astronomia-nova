import type { StorybookConfig } from '@storybook/nextjs';
import path from 'path';

import rehypeKatex from 'rehype-katex'; // Render math with KaTeX.
// import remarkFrontmatter from 'remark-frontmatter'; // YAML and such.
import remarkGfm from 'remark-gfm'; // Tables, footnotes, strikethrough, task lists, literal URLs.
import remarkMath from 'remark-math'; // Support math like `$so$`.

const config: StorybookConfig = {
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  stories: [
    '../src/**/*.stories.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-onboarding',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling',
      options: {},
    },
    {
      name: '@storybook/addon-docs',
      options: {
        mdxPluginOptions: {
          mdxCompileOptions: {
            remarkPlugins: [remarkGfm, remarkMath],
            rehypePlugins: [rehypeKatex],
          },
        },
      },
    },
  ],
  docs: {
    autodocs: 'tag',
  },
  staticDirs: ['../public', '../json'],
  async webpackFinal(config, { configType }) {
    if (configType === 'DEVELOPMENT') {
      // Modify config for development
    }
    if (configType === 'PRODUCTION') {
      // Modify config for production
    }
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname, '../src'),
      };
    }

    return config;
  },
};
export default config;
