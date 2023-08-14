import * as React from 'react';
import { cn } from '@/lib/cn';
import { PropsWithChildren } from 'react';
import * as fonts from '../src/lib/fonts';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { RootStoreProvider } from '@/components/layout/site-layout/providers/root-store-provider';
import { MachineContext } from '@/state/xstate/MachineProviders';
const fontVariables = [fonts.orbitron.variable, fonts.roboto.variable];

const Storybook = ({ children }: PropsWithChildren) => {
  return (
    <div className={cn(...fontVariables)}>
      <div className="h-screen w-screen font-sans">{children}</div>
    </div>
  );
};

export { Storybook };
