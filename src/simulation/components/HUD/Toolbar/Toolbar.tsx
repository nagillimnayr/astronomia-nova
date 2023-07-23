import * as RadixToolbar from '@radix-ui/react-toolbar';
import { ToggleItem } from './ToggleItem';
import {
  AnnotationVisContext,
  MarkerVisContext,
  TrajectoryVisContext,
} from '@/state/xstate/toggle-machine/ToggleMachineProviders';

export const Toolbar = () => {
  return (
    <RadixToolbar.Root className="flex items-center justify-start border p-1">
      {/** Trajectory Visibility Toggle. */}
      <ToggleItem context={TrajectoryVisContext}>
        <span className="icon-[mdi--orbit]" />
      </ToggleItem>
      {/** Annotation Visibility Toggle. */}
      <ToggleItem context={AnnotationVisContext}>
        <span className="icon-[mdi--tag-text]" />
      </ToggleItem>
      {/** Marker Visibility Toggle. */}
      <ToggleItem context={MarkerVisContext}>
        <span className="icon-[mdi--target]" />
      </ToggleItem>
    </RadixToolbar.Root>
  );
};
