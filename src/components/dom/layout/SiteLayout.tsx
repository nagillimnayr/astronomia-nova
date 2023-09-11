'use client';
import { cn } from '@/helpers/cn';
import { orbitron, roboto } from '@/helpers/fonts';

const fontVariables = [orbitron.variable, roboto.variable];

type SiteLayoutProps = {
  children: React.ReactNode;
};
export const SiteLayout = ({ children }: SiteLayoutProps) => {
  return <div className={cn(...fontVariables)}>{children}</div>;
};
