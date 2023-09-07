import * as RadixToolbar from '@radix-ui/react-toolbar';
import { ToggleButton } from './ToggleButton';
import { type ClassNameValue } from 'tailwind-merge';
import { cn } from '@/lib/cn';

type Props = {
  className?: ClassNameValue;
};
export const ToggleBar = ({ className }: Props) => {
  return (
    <RadixToolbar.Root
      className={cn(
        'flex w-fit items-center justify-start gap-1 rounded-md border-2 bg-muted p-1',
        className
      )}
    >
      {/** Trajectory Visibility Toggle. */}
      <ToggleButton target={'trajectories'}>
        <span className="icon-[mdi--orbit] text-xl" />
      </ToggleButton>
      {/** Annotation Visibility Toggle. */}
      <ToggleButton target={'annotations'}>
        <span className="icon-[mdi--tag-text] text-xl" />
      </ToggleButton>
      {/** Marker Visibility Toggle. */}
      <ToggleButton target={'markers'}>
        <span className="icon-[mdi--target] text-xl" />
      </ToggleButton>
      {/** Velocity Arrow Visibility Toggle. */}
      <ToggleButton target={'velocityArrows'} defaultOff>
        <span className="icon-[mdi--arrow-top-right-thin] text-xl" />
      </ToggleButton>
    </RadixToolbar.Root>
  );
};
