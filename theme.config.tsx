import React from 'react';
import { type DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: (
    <strong className="nx-text-slate-900 dark:nx-text-slate-100">
      Astronomia Nova
    </strong>
  ),
  project: {
    link: 'https://github.com/nagillimnayr/astronomia-nova',
  },
  docsRepositoryBase: 'https://github.com/nagillimnayr/astronomia-nova',
  footer: {
    text: 'Astronomia Nova',
  },
  editLink: {
    text: '',
  },

  useNextSeoProps() {
    return {
      titleTemplate: '%s',
    };
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Astronomia Nova" />
      <meta property="og:description" content="Solar System Simulation" />
    </>
  ),
};

export default config;
