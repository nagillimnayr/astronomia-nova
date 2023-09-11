'use client';
import SiteHeader from '@/components/dom/layout/header/SiteHeader';
import { cn } from '@/helpers/cn';
import { orbitron, roboto } from '@/helpers/fonts';
import { MachineContext } from '@/state/xstate/MachineProviders';

const fontVariables = [orbitron.variable, roboto.variable];

type SiteLayoutProps = {
  children: React.ReactNode;
};
export const SiteLayout = ({ children }: SiteLayoutProps) => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <div
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
