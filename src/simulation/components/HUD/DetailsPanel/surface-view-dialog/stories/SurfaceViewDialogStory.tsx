import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { SurfaceViewDialog } from '../SurfaceViewDialog';
import { SurfaceViewButton } from '../SurfaceViewButton';

export const SurfaceViewDialogStory = () => {
  // const { uiActor } = MachineContext.useSelector(({ context }) => context);
  // const { surfaceDialogActor } = useSelector(uiActor, ({ context }) => context);
  return (
    <>
      <div className="absolute left-10 top-10 p-0">
        <SurfaceViewButton />
      </div>
      <div className="grid h-screen w-full place-items-center ">
        <SurfaceViewDialog />
      </div>
    </>
  );
};
