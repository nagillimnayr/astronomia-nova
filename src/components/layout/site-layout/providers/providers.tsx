import { MDXProvider } from '@mdx-js/react';
import { ThemeProvider } from './theme-provider';

type ProviderProps = {
  children: React.ReactNode;
};

const components = {};

const Providers = ({ children }: ProviderProps) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <MDXProvider components={components}>{children}</MDXProvider>
    </ThemeProvider>
  );
};

export default Providers;
