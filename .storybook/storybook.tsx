import * as React from 'react';
import { cn } from '@/helpers/cn';
import { PropsWithChildren } from 'react';
import * as fonts from '@/helpers/fonts';

const fontVariables = [fonts.orbitron.variable, fonts.roboto.variable];

const Storybook = ({ children }: PropsWithChildren) => {
  return (
    <div className={cn(...fontVariables)}>
      <div className="h-screen w-screen font-sans">{children}</div>
    </div>
  );
};

export { Storybook };
