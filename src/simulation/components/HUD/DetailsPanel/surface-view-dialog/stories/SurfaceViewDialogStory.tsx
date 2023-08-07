import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { SurfaceViewDialog } from '../SurfaceViewDialog';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

export const SurfaceViewDialogStory = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const { screenPortalRef } = useSelector(uiActor, ({ context }) => context);
  return (
    <>
      <div
        ref={screenPortalRef}
        className="grid h-screen w-full place-items-center "
      >
        <AlertDialog.Root defaultOpen>
          <AlertDialog.Trigger asChild>
            <button className="pointer-events-auto rounded-lg border-2 border-white p-2 hover:bg-muted">
              button
            </button>
          </AlertDialog.Trigger>

          <SurfaceViewDialog />
        </AlertDialog.Root>
      </div>
    </>
  );
};
