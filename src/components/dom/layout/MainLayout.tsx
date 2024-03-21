'use client';
import { cn } from '@/helpers/cn';
import { SiteHeader } from '@/components/dom/layout/header/SiteHeader';

type SiteLayoutProps = {
  children: React.ReactNode;
};
export const MainLayout = ({ children }: SiteLayoutProps) => {
  return (
    <div
      className={cn(
        `relative left-0 top-0 m-0 h-screen max-h-screen min-h-screen w-screen min-w-fit 
        bg-background p-0 font-sans text-foreground`,
        'grid',
        'grid-cols-[8rem_1fr_8rem]',
        'sm:grid-cols-[12rem_1fr_12rem] xl:grid-cols-[16rem_1fr_16rem]',
        'grid-rows-[5rem_1fr_5rem]',
        'items-stretch justify-stretch'
      )}
    >
      {/** Header */}
      <div className="z-[1] col-start-1 col-end-[-1] row-span-1 row-start-1 hidden sm:block">
        <SiteHeader />
      </div>

      {/** Canvas */}
      <div className="z-[0] col-start-1 col-end-[-1] row-start-1 row-end-[-1] sm:row-start-2">
        {children}
      </div>
    </div>
  );
};
