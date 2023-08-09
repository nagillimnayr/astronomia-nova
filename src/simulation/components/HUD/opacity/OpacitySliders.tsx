import { Label } from '@/components/ui/label';
import { Slider } from '@/components/gui/slider/Slider';
import { Input } from '@/components/ui/input';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { cn } from '@/lib/cn';
import { ClassNameValue } from 'tailwind-merge';

type Props = {
  direction?: 'horizontal' | 'vertical';
  className?: ClassNameValue;
};
export const OpacitySliders = ({
  direction = 'horizontal',
  className,
}: Props) => {
  const { celestialSphereActor } = MachineContext.useSelector(
    ({ context }) => context
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
      <div
        data-direction={direction}
        className={cn(
          'flex min-h-fit w-full items-start justify-center gap-4 rounded-lg bg-muted p-0 data-[direction=horizontal]:flex-row data-[direction=vertical]:flex-col',
          className
        )}
      >
        <Label className="inline-flex w-full flex-col gap-1">
          Constellation Opacity
          <div className="inline-flex h-fit w-full flex-row items-center justify-start gap-2">
            <Slider
              tooltip
              className={'w-full'}
              value={[constellationOpacity]}
              name="constellation-opacity-slider"
              min={0}
              max={1}
              step={0.01}
              onValueChange={(values) => {
                const value = values[0];
                if (!value && value !== 0) return;
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
        <Label className="inline-flex w-full flex-col gap-1">
          Grid Opacity
          <div className="inline-flex h-fit w-full flex-row items-center justify-start gap-2">
            <Slider
              tooltip
              className={'w-full'}
              value={[celestialGridOpacity]}
              name="celestial-grid-opacity-slider"
              min={0}
              max={1}
              step={0.01}
              onValueChange={(values) => {
                const value = values[0];
                if (!value && value !== 0) return;
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
    </>
  );
};
