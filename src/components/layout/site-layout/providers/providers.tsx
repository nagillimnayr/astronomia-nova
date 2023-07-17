'use client';
import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider } from './theme-provider';
import { RootStoreProvider } from './root-store-provider';
import { type PropsWithChildren } from 'react';

const components = {};

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RootStoreProvider>
        <MDXProvider components={components}>{children}</MDXProvider>
      </RootStoreProvider>
    </ThemeProvider>
  );
};

export default Providers;
