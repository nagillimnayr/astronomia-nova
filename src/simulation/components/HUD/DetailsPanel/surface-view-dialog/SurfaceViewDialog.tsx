import { Slider } from '@/components/gui/Slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { MachineContext } from '@/state/xstate/MachineProviders';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { observer } from 'mobx-react-lite';
import { useCallback, useContext } from 'react';
import { useActor, useSelector } from '@xstate/react';

const SurfaceViewDialog = observer(() => {
  const { uiActor, cameraActor, surfaceActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const { surfaceDialogActor, screenPortalRef } = useSelector(
    uiActor,
    ({ context }) => context
  );

  const { latitude, longitude } = useSelector(
    surfaceActor,
    ({ context }) => context
  );

  const close = useCallback(() => {
    surfaceDialogActor.send({ type: 'CLOSE' });
  }, [surfaceDialogActor]);
  return (
    <AlertDialog.Portal container={screenPortalRef.current}>
      <AlertDialog.Overlay className="prose fixed left-1/2 top-1/2 flex h-48 w-96 max-w-[50vw] -translate-x-1/2 translate-y-1/2 flex-col items-center justify-start overflow-hidden rounded-lg bg-card px-10 py-3 font-sans prose-headings:m-0">
        <AlertDialog.Title className="m-0 text-center text-3xl ">
          Surface View
        </AlertDialog.Title>
        <AlertDialog.Description className="my-1"></AlertDialog.Description>

        <AlertDialog.Content className="mt-0 grid h-full w-full grid-cols-2 grid-rows-2 place-items-stretch gap-x-6 gap-y-4 font-sans">
          {/** Inputs for latitude and longitude. */}

          <div className="col-span-1 col-start-1 row-span-1 row-start-1 flex flex-col items-start justify-center">
            <Label className="mb-2 inline-flex items-center justify-center">
              Latitude
              <Input
                className="h-6 w-full"
                type="number"
                value={latitude}
                min={-180}
                max={180}
                step={0.5}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  if (!value && value !== 0) return;
                  surfaceActor.send({ type: 'SET_LATITUDE', value });
                }}
              />
            </Label>
            <Slider
              name="latitude-slider"
              value={[latitude]}
              min={-180}
              max={180}
              step={0.1}
              className="w-full"
              onValueChange={(values) => {
                const value = values[0];
                if (!value) return;
                surfaceActor.send({ type: 'SET_LATITUDE', value });
              }}
            />
          </div>
          <div className="col-span-1 col-start-2 row-span-1 row-start-1 flex flex-col items-start justify-center">
            <Label className="mb-2 inline-flex items-center justify-center ">
              Longitude
              <Input
                className="h-6  w-full"
                type="number"
                value={longitude}
                min={-90}
                max={90}
                step={0.5}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  if (!value && value !== 0) return;
                  surfaceActor.send({ type: 'SET_LONGITUDE', value });
                }}
              />
            </Label>
            <Slider
              name="longitude-slider"
              value={[longitude]}
              min={-90}
              max={90}
              step={0.1}
              className="w-full"
              onValueChange={(values) => {
                const value = values[0];
                if (!value) return;
                surfaceActor.send({ type: 'SET_LONGITUDE', value });
              }}
            />
          </div>
          {/** Cancel button. */}
          <AlertDialog.Cancel
            asChild
            className="col-span-1 col-start-1 row-span-1 row-start-2"
          >
            <button
              className=" h-fit w-full min-w-fit  place-items-center rounded-md border border-muted px-2 py-1 text-xl hover:bg-muted"
              onClick={close}
            >
              Cancel
            </button>
          </AlertDialog.Cancel>
          {/** Confirm button. */}
          <AlertDialog.Action
            asChild
            className="col-span-1 col-start-2 row-span-1 row-start-2"
          >
            <button
              className="h-fit  w-full min-w-fit place-items-center rounded-md  border border-muted  px-2 py-1 text-xl hover:bg-muted"
              onClick={() => {
                cameraActor.send('TO_SURFACE');
                close();
              }}
            >
              Confirm
            </button>
          </AlertDialog.Action>
        </AlertDialog.Content>
      </AlertDialog.Overlay>
    </AlertDialog.Portal>
  );
});

export { SurfaceViewDialog };
