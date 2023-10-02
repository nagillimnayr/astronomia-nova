import React from 'react';
import { type DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  logo: <strong>Astronomia Nova</strong>,
  project: {
    link: 'https://github.com/nagillimnayr/astronomia-nova',
  },
  docsRepositoryBase: 'https://github.com/nagillimnayr/astronomia-nova',
  footer: {
    text: 'Astronomia Nova Documentation',
  },
  editLink: {
    text: '',
  },

  useNextSeoProps() {
    return {
      titleTemplate: '%s',
    };
  },
};

export default config;
