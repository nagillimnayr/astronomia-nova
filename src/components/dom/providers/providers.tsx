'use client';
import { MachineProviders } from '@/state/xstate/MachineProviders';
import { MDXProvider } from '@mdx-js/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren } from 'react';
import { ThemeProvider } from './theme-provider';

const components = {};

// React Query
const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MachineProviders>
        <QueryClientProvider client={queryClient}>
          <MDXProvider components={components}>{children}</MDXProvider>
        </QueryClientProvider>
      </MachineProviders>
    </ThemeProvider>
  );
};

export default Providers;
