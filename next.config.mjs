/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import('./src/env.mjs');

import bundleAnalyzer from '@next/bundle-analyzer';
import mdx from '@next/mdx';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeSlug from 'rehype-slug';
import rehypeCitation from 'rehype-citation';

import nextra from 'nextra';

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  latex: true,
});

const withMDX = mdx({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeCitation, rehypeKatex, rehypeSlug],
    // If you use `MDXProvider`, uncomment the following line.
    providerImportSource: '@mdx-js/react',
  },
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  // i18n: {
  //   locales: ['en'],
  //   defaultLocale: 'en',
  // },
  transpilePackages: ['three', 'drei'],
  webpack(config, { isServer }) {
    if (!isServer) {
      // We're in the browser build, so we can safely exclude the sharp module
      config.externals.push('sharp');
    }
    // // audio support
    // config.module.rules.push({
    //   test: /\.(ogg|mp3|wav|mpe?g)$/i,
    //   exclude: config.exclude,
    //   use: [
    //     {
    //       loader: require.resolve('url-loader'),
    //       options: {
    //         limit: config.inlineImageLimit,
    //         fallback: require.resolve('file-loader'),
    //         publicPath: `${config.assetPrefix}/_next/static/images/`,
    //         outputPath: `${isServer ? '../' : ''}static/images/`,
    //         name: '[name]-[hash].[ext]',
    //         esModule: config.esModule || false,
    //       },
    //     },
    //   ],
    // });

    // shader support
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ['raw-loader', 'glslify-loader'],
    });

    return config;
  },
};

// export default withMDX(nextConfig);
export default withNextra(nextConfig);
