import { Input } from '@/components/dom/ui/input';
import { Label } from '@/components/dom/ui/label';
import { Slider } from '@/components/dom/ui/slider/Slider';
import {
  MAX_LATITUDE,
  MAX_LONGITUDE,
  MIN_LATITUDE,
  MIN_LONGITUDE,
} from '@/constants/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useActor, useSelector } from '@xstate/react';

import { useCallback, useEffect, useRef } from 'react';

const SurfaceViewDialog = () => {
  const { uiActor, cameraActor, surfaceActor, visibilityActor } =
    MachineContext.useSelector(({ context }) => context);
  const { surfaceDialogActor } = useSelector(uiActor, ({ context }) => context);

  const { latitude, longitude } = useSelector(
    surfaceActor,
    ({ context }) => context
  );
  const trajectories = useSelector(
    visibilityActor,
    ({ context }) => context.trajectories
  );

  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // If ref has not already been set in the actor's context. Set it.
    const dialogRef = surfaceDialogActor.getSnapshot()!.context.dialogRef;
    if (!dialogRef) {
      surfaceDialogActor.send({ type: 'SET_REF', ref: divRef });
    }
  }, [surfaceDialogActor]);

  const close = useCallback(() => {
    surfaceDialogActor.send({ type: 'CLOSE' });
  }, [surfaceDialogActor]);

  const confirm = useCallback(() => {
    cameraActor.send('TO_SURFACE');
    surfaceDialogActor.send({ type: 'CLOSE' });
    // trajectories.send({ type: 'DISABLE' });
  }, [cameraActor, surfaceDialogActor, trajectories]);

  const [state, send] = useActor(surfaceDialogActor);

  return (
    <div
      ref={divRef}
      data-state={state.value}
      className="prose pointer-events-auto flex h-40 w-96 max-w-[50vw] flex-col items-center justify-center overflow-hidden rounded-lg border-2 bg-card px-6 font-sans data-[state=closed]:hidden prose-headings:m-0"
    >
      {/** Title. */}
      {/* <header className="m-0 text-center text-3xl">Surface View</header> */}

      {/** Content. */}
      <div className="my-auto flex h-full w-full grid-cols-2 grid-rows-2 flex-col items-stretch justify-center gap-x-6 gap-y-4 font-sans">
        {/** Inputs for latitude and longitude. */}

        <div className="flex flex-row items-center justify-center gap-6">
          <div className="flex flex-col items-start justify-center">
            <Label className="mb-2 inline-flex items-center justify-center">
              Latitude&nbsp;
              <Input
                className="h-6 w-full"
                type="number"
                value={latitude}
                min={MIN_LATITUDE}
                max={MAX_LATITUDE}
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
              min={MIN_LATITUDE}
              max={MAX_LATITUDE}
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
              Longitude&nbsp;
              <Input
                className="h-6  w-full"
                type="number"
                value={longitude}
                min={MIN_LONGITUDE}
                max={MAX_LATITUDE}
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
              min={MIN_LONGITUDE}
              max={MAX_LONGITUDE}
              step={0.1}
              className="w-full"
              onValueChange={(values) => {
                const value = values[0];
                if (!value) return;
                surfaceActor.send({ type: 'SET_LONGITUDE', value });
              }}
            />
          </div>
        </div>

        <div className="flex flex-row items-center justify-stretch gap-6 ">
          {/** Cancel button. */}

          <button
            className="h-fit w-full min-w-fit  place-items-center rounded-md border border-muted px-2 py-1 text-xl hover:bg-muted"
            onClick={close}
          >
            Cancel
          </button>

          {/** Confirm button. */}
          <button
            className="col-span-1 col-start-2 row-span-1 row-start-2 h-fit w-full min-w-fit place-items-center rounded-md  border border-muted px-2 py-1 text-xl hover:bg-muted"
            onClick={confirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export { SurfaceViewDialog };
