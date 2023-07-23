import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-styling';
import * as React from 'react';
import * as fonts from '../src/lib/fonts';

import '../src/styles/globals.css';
import { cn } from '../src/lib/cn';
import { Storybook } from './storybook';
import Providers from '@/components/layout/site-layout/providers/providers';

const fontVariables = [
  fonts.atomicAge.variable,
  fonts.orbitron.variable,
  fonts.roboto.variable,
];

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  decorators: [
    // Adds theme switching support.
    // NOTE: requires setting "darkMode" to "class" in your tailwind config
    withThemeByClassName({
      themes: {
        light: 'light',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
    (Story) => {
      return (
        <Providers>
          <Storybook>
            <Story />
          </Storybook>
        </Providers>
      );
    },
  ],
};

export default preview;
