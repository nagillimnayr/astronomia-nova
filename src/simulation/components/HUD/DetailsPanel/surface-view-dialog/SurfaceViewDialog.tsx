import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { useContext } from 'react';

const SurfaceViewDialog = () => {
  const { uiState } = useContext(RootStoreContext);
  return (
    <AlertDialog.Portal container={uiState.screenPortal}>
      <AlertDialog.Overlay className="prose fixed left-1/2 top-1/2 flex h-60 w-96 max-w-[50vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center rounded-lg bg-card p-4 font-sans">
        <AlertDialog.Title className="text-center text-3xl">
          Surface View
        </AlertDialog.Title>
        <AlertDialog.Description></AlertDialog.Description>
        <AlertDialog.Content className="mt-auto flex w-full flex-row items-center justify-center gap-8 font-sans">
          {/** Cancel button. */}
          <AlertDialog.Cancel asChild>
            <button className="col-span-1 col-start-2 h-fit w-16 min-w-fit  place-items-center rounded-md border border-muted px-2 py-1 text-xl hover:bg-muted ">
              Cancel
            </button>
          </AlertDialog.Cancel>
          {/** Confirm button. */}
          <AlertDialog.Action asChild>
            <button className="col-span-1 col-end-[-2] h-fit  w-16 min-w-fit place-items-center rounded-md  border border-muted  px-2 py-1 text-xl hover:bg-muted">
              Confirm
            </button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Overlay>
    </AlertDialog.Portal>
  );
};

export { SurfaceViewDialog };
