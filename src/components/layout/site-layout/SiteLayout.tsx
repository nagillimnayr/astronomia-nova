'use client';
import { cn } from '@/lib/cn';
import { atomicAge, orbitron, roboto } from '@/lib/fonts';
import SiteHeader from './header/SiteHeader';
import { BottomToolbar } from '../BottomToolbar';
import { useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

const fontVariables = [atomicAge.variable, orbitron.variable, roboto.variable];

type SiteLayoutProps = {
  children: React.ReactNode;
};
const SiteLayout = ({ children }: SiteLayoutProps) => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);

  const screenPortalRef = useSelector(
    uiActor,
    ({ context }) => context.screenPortalRef
  );

  return (
    <div
      ref={screenPortalRef}
      className={cn(
        ...fontVariables,
        `relative left-0 top-0 m-0 h-full max-h-full min-h-screen w-screen bg-background p-0 font-sans text-foreground`,
        'grid',
        'grid-cols-[12rem_1fr_12rem] xl:grid-cols-[16rem_1fr_16rem]',
        'grid-rows-[5rem_1fr_5rem]',
        'items-stretch justify-stretch'
      )}
    >
      {/** Header */}
      <div className="z-[1] col-start-1 col-end-[-1] row-span-1 row-start-1">
        <SiteHeader />
      </div>

      {/** Canvas */}
      <div className="z-[0] col-start-1 col-end-[-1]   row-start-2 row-end-[-1]">
        {children}
      </div>
    </div>
  );
};

export default SiteLayout;
