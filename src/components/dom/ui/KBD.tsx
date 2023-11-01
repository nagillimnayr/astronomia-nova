import { type PropsWithChildren } from 'react';

export const KBD = ({ children }: PropsWithChildren) => {
  return (
    <>
      <kbd className="mx-1 inline-flex h-6 min-w-[1.5rem] items-center justify-center rounded-md border border-b-[3px]  border-neutral-400 bg-neutral-800 px-1 py-0 text-center text-neutral-100 outline outline-1 outline-border dark:border-neutral-300">
        {children}
      </kbd>
    </>
  );
};
