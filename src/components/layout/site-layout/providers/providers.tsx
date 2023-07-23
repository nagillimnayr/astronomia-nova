'use client';
import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider } from './theme-provider';
import { RootStoreProvider } from './root-store-provider';
import { type PropsWithChildren } from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { MachineProviders } from '@/state/xstate/MachineProviders';

const components = {};

// React Query
const queryClient = new QueryClient();

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <RootStoreProvider>
        <MachineProviders>
          <QueryClientProvider client={queryClient}>
            <MDXProvider components={components}>{children}</MDXProvider>
          </QueryClientProvider>
        </MachineProviders>
      </RootStoreProvider>
    </ThemeProvider>
  );
};

export default Providers;
