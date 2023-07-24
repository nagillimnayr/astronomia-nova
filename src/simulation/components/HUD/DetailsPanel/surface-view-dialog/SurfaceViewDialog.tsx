import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { observer } from 'mobx-react-lite';
import { useContext } from 'react';

const SurfaceViewDialog = observer(() => {
  const { uiState, surfaceState } = useContext(RootStoreContext);

  return (
    <AlertDialog.Portal container={uiState.screenPortal}>
      <AlertDialog.Overlay className="prose fixed left-1/2 top-1/2 flex h-48 w-96 max-w-[50vw] -translate-x-1/2 translate-y-1/2 flex-col items-center justify-start overflow-hidden rounded-lg bg-card px-14 py-3 font-sans prose-headings:m-0">
        <AlertDialog.Title className="m-0 text-center text-3xl ">
          Surface View
        </AlertDialog.Title>
        <AlertDialog.Description className="my-1"></AlertDialog.Description>

        <AlertDialog.Content className="mt-0 grid h-full w-full grid-cols-2 grid-rows-2 place-items-stretch gap-x-6 gap-y-4 font-sans">
          {/** Inputs for latitude and longitude. */}
          <div className="col-span-1 col-start-1 row-span-1 row-start-1">
            <Label className="mb-2">
              Longitude
              <Input
                className="w-full"
                type="number"
                value={surfaceState.longitude}
                min={-180}
                max={180}
                step={0.5}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  if (!value && value !== 0) return;
                  surfaceState.setLongitude(value);
                }}
              />
            </Label>
          </div>
          <div className="col-span-1 col-start-2 row-span-1 row-start-1">
            <Label className="mb-2">
              Latitude
              <Input
                className="w-full"
                type="number"
                value={surfaceState.latitude}
                min={-90}
                max={90}
                step={0.5}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  if (!value && value !== 0) return;
                  surfaceState.setLatitude(value);
                }}
              />
            </Label>
          </div>

          {/** Cancel button. */}
          <AlertDialog.Cancel
            asChild
            className="col-span-1 col-start-1 row-span-1 row-start-2"
          >
            <button className=" h-fit w-full min-w-fit  place-items-center rounded-md border border-muted px-2 py-1 text-xl hover:bg-muted ">
              Cancel
            </button>
          </AlertDialog.Cancel>
          {/** Confirm button. */}
          <AlertDialog.Action
            asChild
            className="col-span-1 col-start-2 row-span-1 row-start-2"
          >
            <button className="h-fit  w-full min-w-fit place-items-center rounded-md  border border-muted  px-2 py-1 text-xl hover:bg-muted">
              Confirm
            </button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Overlay>
    </AlertDialog.Portal>
  );
});

export { SurfaceViewDialog };
