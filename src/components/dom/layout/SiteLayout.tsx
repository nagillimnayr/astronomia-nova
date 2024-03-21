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
        className={cn(
          ...fontVariables,
          'm-0 h-screen min-h-fit w-screen min-w-fit'
        )}
      >
        {children}
      </div>
      <Analytics />
    </>
  );
};
