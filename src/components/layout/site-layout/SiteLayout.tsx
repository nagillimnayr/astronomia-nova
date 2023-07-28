'use client';
import { cn } from '@/lib/cn';
import { atomicAge, orbitron, roboto } from '@/lib/fonts';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { BottomToolbar } from '../BottomToolbar';
import { useContext, useEffect, useRef } from 'react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';

const fontVariables = [atomicAge.variable, orbitron.variable, roboto.variable];

type SiteLayoutProps = {
  children: React.ReactNode;
};
const SiteLayout = ({ children }: SiteLayoutProps) => {
  const { uiService } = useContext(GlobalStateContext);

  const screenPortalRef = useRef<HTMLDivElement>(null!);

  useEffect(() => {
    uiService.send({
      type: 'ASSIGN_SCREEN_PORTAL_REF',
      screenPortalRef: screenPortalRef,
    });
  }, [uiService]);

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

      {/** Outliner */}
      <div className="z-[1] col-span-1 col-start-1 row-span-1 row-start-2">
        <Sidebar />
      </div>

      {/** Canvas */}
      <div className="z-[0] col-span-1 col-start-2 row-span-1  row-start-2">
        {children}
      </div>

      {/** Todo: Put something here */}
      <div className="z-[1] col-start-[-2] col-end-[-1] row-span-1 row-start-2">
        <div className="h-full w-full bg-muted" />
      </div>

      {/** Toolbar (Time controls, toggle buttons, etc) */}
      <div className="z-[1] col-start-1 col-end-[-1] row-start-[-2] row-end-[-1]">
        <BottomToolbar />
      </div>
    </div>
  );
};

export default SiteLayout;
