import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';

const SurfaceViewDialog = observer(() => {
  const { uiState, surfaceState } = useContext(RootStoreContext);

  return (
    <AlertDialog.Portal container={uiState.screenPortal}>
      <AlertDialog.Overlay className="prose fixed left-1/2 top-1/2 flex h-48 w-96 max-w-[50vw] -translate-x-1/2 -translate-y-1/2 flex-col items-center overflow-hidden rounded-lg bg-card p-3 font-sans prose-headings:m-0">
        <AlertDialog.Title className="m-0 text-center text-3xl">
          Surface View
        </AlertDialog.Title>
        <AlertDialog.Description></AlertDialog.Description>

        <AlertDialog.Content className=" flex h-full w-full flex-col items-center justify-center font-sans">
          <div className="pointer-events-auto flex min-h-fit min-w-fit flex-row items-center justify-center gap-6">
            {/** Inputs for latitude and longitude. */}
            <Label className="mb-2">
              Latitude
              <Input
                type="number"
                value={surfaceState.latitude}
                min={0}
                max={360}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  surfaceState.setLatitude(value);
                  console.log(value);
                }}
              />
            </Label>
            <Label className="mb-2">
              Longitude
              <Input
                type="number"
                value={surfaceState.longitude}
                min={0}
                max={360}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  surfaceState.setLongitude(value);
                  console.log(value);
                }}
              />
            </Label>
          </div>
          <div className=" flex w-full flex-row items-center justify-center gap-8">
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
          </div>
        </AlertDialog.Content>
      </AlertDialog.Overlay>
    </AlertDialog.Portal>
  );
});

export { SurfaceViewDialog };
