import { type PropsWithChildren } from 'react';

export const KBD = ({ children }: PropsWithChildren) => {
  return (
    <>
      <kbd className="mx-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-sm border-b-4 border-gray-300 bg-neutral-800 px-1 py-0 outline outline-2 outline-border">
        {children}
      </kbd>
    </>
  );
};
