import { type PropsWithChildren } from 'react';

export const Prose = ({ children }: PropsWithChildren) => {
  return (
    <div className="prose mx-auto my-12 font-sans prose-headings:mb-2 prose-headings:mt-1 prose-headings:font-display prose-h5:font-medium prose-img:mx-auto prose-hr:my-2">
      {children}
    </div>
  );
};
