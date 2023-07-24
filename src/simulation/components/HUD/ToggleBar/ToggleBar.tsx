import * as RadixToolbar from '@radix-ui/react-toolbar';
import { ToggleItem } from './ToggleItem';
import {
  AnnotationVisContext,
  MarkerVisContext,
  TrajectoryVisContext,
} from '@/state/xstate/toggle-machine/ToggleMachineProviders';
import { type ClassNameValue } from 'tailwind-merge';
import { cn } from '@/lib/cn';

type Props = {
  className: ClassNameValue;
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
      <ToggleItem context={TrajectoryVisContext}>
        <span className="icon-[mdi--orbit] text-xl" />
      </ToggleItem>
      {/** Annotation Visibility Toggle. */}
      <ToggleItem context={AnnotationVisContext}>
        <span className="icon-[mdi--tag-text] text-xl" />
      </ToggleItem>
      {/** Marker Visibility Toggle. */}
      <ToggleItem context={MarkerVisContext}>
        <span className="icon-[mdi--target] text-xl" />
      </ToggleItem>
    </RadixToolbar.Root>
  );
};
