import * as RadixToolbar from '@radix-ui/react-toolbar';
import { ToggleItem } from './ToggleItem';
import {
  AnnotationVisContext,
  MarkerVisContext,
  TrajectoryVisContext,
} from '@/state/xstate/toggle-machine/ToggleMachineProviders';

export const ToggleBar = () => {
  return (
    <RadixToolbar.Root className="flex items-center justify-start gap-1 rounded-md border-2 p-1">
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
