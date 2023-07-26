import * as RadixToolbar from '@radix-ui/react-toolbar';
import { ToggleItem } from './ToggleItem';

import { type ClassNameValue } from 'tailwind-merge';
import { cn } from '@/lib/cn';
import { useContext } from 'react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';

type Props = {
  className?: ClassNameValue;
};
export const ToggleBar = ({ className }: Props) => {
  const { trajectoryVis, annotationVis, markerVis, velArrowVis } =
    useContext(GlobalStateContext);
  return (
    <RadixToolbar.Root
      className={cn(
        'flex w-fit items-center justify-start gap-1 rounded-md border-2 bg-muted p-1',
        className
      )}
    >
      {/** Trajectory Visibility Toggle. */}
      <ToggleItem service={trajectoryVis}>
        <span className="icon-[mdi--orbit] text-xl" />
      </ToggleItem>
      {/** Annotation Visibility Toggle. */}
      <ToggleItem service={annotationVis}>
        <span className="icon-[mdi--tag-text] text-xl" />
      </ToggleItem>
      {/** Marker Visibility Toggle. */}
      <ToggleItem service={markerVis}>
        <span className="icon-[mdi--target] text-xl" />
      </ToggleItem>
      {/** Velocity Arrow Visibility Toggle. */}
      <ToggleItem service={velArrowVis}>
        <span className="icon-[mdi--arrow-top-right-thin] text-xl" />
      </ToggleItem>
    </RadixToolbar.Root>
  );
};
