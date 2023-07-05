import { MDXProvider } from '@mdx-js/react';

type ProviderProps = {
  children: React.ReactNode;
};

const components = {};

const Providers = ({ children }: ProviderProps) => {
  return (
    <>
      <MDXProvider components={components}>{children}</MDXProvider>
    </>
  );
};

export default Providers;
