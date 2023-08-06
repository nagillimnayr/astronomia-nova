import * as React from 'react';
import { cn } from '@/lib/cn';
import { PropsWithChildren } from 'react';
import * as fonts from '../src/lib/fonts';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { RootStoreProvider } from '@/components/layout/site-layout/providers/root-store-provider';
import { MachineContext } from '@/state/xstate/MachineProviders';
const fontVariables = [
  fonts.atomicAge.variable,
  fonts.orbitron.variable,
  fonts.roboto.variable,
];

const Storybook = ({ children }: PropsWithChildren) => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const screenPortalRef = React.useRef<HTMLDivElement>(null!);
  uiActor.send({ type: 'ASSIGN_SCREEN_PORTAL_REF', screenPortalRef });
  return (
    <div className={cn(...fontVariables)} ref={screenPortalRef}>
      <div className="font-sans">{children}</div>
    </div>
  );
};

export { Storybook };
