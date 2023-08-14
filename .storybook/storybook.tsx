import * as React from 'react';
import { cn } from '@/lib/cn';
import { PropsWithChildren } from 'react';
import * as fonts from '../src/lib/fonts';

const fontVariables = [fonts.orbitron.variable, fonts.roboto.variable];

const Storybook = ({ children }: PropsWithChildren) => {
  return (
    <div className={cn(...fontVariables)}>
      <div className="h-screen w-screen font-sans">{children}</div>
    </div>
  );
};

export { Storybook };
