import { Label } from '@/components/ui/label';
import { Slider } from '@/components/gui/Slider';
import { Input } from '@/components/ui/input';
import { useContext } from 'react';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

export const OpacitySliders = () => {
  const { rootActor } = useContext(GlobalStateContext);

  const celestialSphereActor = useSelector(
    rootActor,
    ({ context }) => context.celestialSphereActor
  );

  const { constellations, celestialGrid } = useSelector(
    celestialSphereActor,
    ({ context }) => context
  );
  const constellationOpacity = useSelector(
    constellations,
    ({ context }) => context.opacity
  );
  const celestialGridOpacity = useSelector(
    celestialGrid,
    ({ context }) => context.opacity
  );

  return (
    <>
      <div className="flex min-h-fit w-64 flex-row items-start justify-center gap-4 rounded-lg bg-muted p-4">
        <div className="">
          <Label className="inline-flex flex-col">
            Constellation Opacity
            <div className="inline-flex h-fit w-full flex-row items-center justify-start gap-2">
              <Slider
                value={[constellationOpacity]}
                name="constellation-opacity-slider"
                min={0}
                max={1}
                step={0.01}
                onValueChange={(values) => {
                  const value = values[0];
                  if (!value) return;
                  constellations.send({ type: 'SET_OPACITY', opacity: value });
                }}
              />
              {/* <Input
                className="h-6 w-16 text-sm"
                type="number"
                value={constellationOpacity}
                min={0}
                max={1}
                step={0.01}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  if (!value && value !== 0) return;
                  constellations.send({ type: 'SET_OPACITY', opacity: value });
                }}
              /> */}
            </div>
          </Label>
        </div>
        <div className="">
          <Label className="inline-flex flex-col">
            Grid Opacity
            <div className="inline-flex h-fit w-full flex-row items-center justify-start gap-2">
              <Slider
                value={[celestialGridOpacity]}
                name="celestial-grid-opacity-slider"
                min={0}
                max={1}
                step={0.01}
                onValueChange={(values) => {
                  const value = values[0];
                  if (!value) return;
                  celestialGrid.send({ type: 'SET_OPACITY', opacity: value });
                }}
              />
              {/* <Input
                className="h-6 w-16 text-sm"
                type="number"
                value={celestialGridOpacity}
                min={0}
                max={1}
                step={0.01}
                onChange={(event) => {
                  const value = parseFloat(event.target.value);
                  if (!value && value !== 0) return;
                  celestialGrid.send({ type: 'SET_OPACITY', opacity: value });
                }}
              /> */}
            </div>
          </Label>
        </div>
      </div>
    </>
  );
};
