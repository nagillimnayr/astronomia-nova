'use client';
import { cn } from '@/helpers/cn';
import { orbitron, roboto } from '@/helpers/fonts';
import { Analytics } from '@vercel/analytics/react';

const fontVariables = [orbitron.variable, roboto.variable];

type SiteLayoutProps = {
  children: React.ReactNode;
};
export const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <>
      <div
        className={cn(...fontVariables, 'h-full min-h-fit w-full min-w-fit')}
      >
        {children}
      </div>
      <Analytics />
    </>
  );
};
