'use strict';

module.exports = {
  recurseDepth: 10,
  source: {
    include: ['src'],
    includePattern: '\\.(jsdoc|js|jsx|ts|tsx))$',
    excludePattern: '(^|\\/|\\\\)_',
  },
  sourceType: 'module',
  tags: {
    allowUnknownTags: true,
    dictionaries: ['jsdoc', 'closure'],
  },
  templates: {
    cleverLinks: false,
    monospaceLinks: false,
  },

  plugins: ['plugins/markdown'],
  opts: {
    destination: 'docs',
    recurse: true,
    readme: 'README.md',
  },
};
