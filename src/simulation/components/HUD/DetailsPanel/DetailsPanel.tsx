import { useCallback, useContext } from 'react';
import { Separator } from '@/components/gui/Separator';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { observer } from 'mobx-react-lite';
import { SurfaceViewButton } from './surface-view-dialog/SurfaceViewButton';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { DIST_MULT } from '@/simulation/utils/constants';
import { useSelector } from '@xstate/react';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import { SpaceViewButton } from './surface-view-dialog/SpaceViewButton';
import { cn } from '@/lib/cn';

const DetailsPanel = observer(() => {
  const { cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  const handleCloseClick = useCallback(() => {
    // Deselect selected object.
    selectionActor.send('DESELECT');
  }, [selectionActor]);

  const handleFocusClick = useCallback(() => {
    // Focus camera on selection.
    cameraActor.send({
      type: 'SET_TARGET',
      focusTarget: selected,
    });
  }, [cameraActor, selected]);

  // if (!selected) return null; // If nothing is selected, display nothing.
  let orbit: KeplerOrbit | null = null;
  if (selected?.parent instanceof KeplerOrbit) {
    orbit = selected.parent;
  }

  return (
    <div
      className={cn(
        'relative flex h-80 w-60 flex-col items-center justify-start gap-2 rounded-sm border bg-muted p-4 text-muted-foreground',
        !selected ? 'scale-0' : 'scale-100'
      )}
    >
      {/** Close button. */}
      <button className="absolute right-0 top-0 h-fit w-fit p-1">
        <span
          onClick={handleCloseClick}
          className="icon-[mdi--close-box-outline] pointer-events-auto aspect-square text-xl text-muted-foreground transition-colors hover:cursor-pointer hover:text-yellow-400 "
        />
      </button>

      {/** Name. */}
      <header className="flex w-full flex-row items-center justify-center">
        <h4 className="text-xl">{selected?.name}</h4>
      </header>
      <Separator className="w-full bg-border" />
      {/** Attributes. */}
      <div className="h-full max-h-full w-full overflow-auto whitespace-nowrap border p-1">
        <div className="flex w-full flex-col items-start justify-start">
          {/** Mass. */}
          <span>
            Mass:
            <br />
            <span>{selected?.mass.toExponential(3)}</span>&nbsp;kg
          </span>
          {/** Radius. */}
          <span>
            Mean radius:
            <br />
            <span>{selected?.meanRadius.toExponential(3)}</span>
            &nbsp;m
          </span>
          {/** Orbital Period */}
          {orbit ? (
            <span>
              Orbital Period:
              <br />
              <span>{orbit.orbitalPeriod.toFixed(2)}</span>
              &nbsp;Days
            </span>
          ) : null}
        </div>
        <div className="flex w-full flex-col items-start justify-start"></div>
      </div>

      <div className="mt-auto flex w-full flex-row items-start  justify-between">
        {/** Camera focus button. */}
        <button
          onClick={handleFocusClick}
          className="pointer-events-auto flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground"
        >
          Focus&nbsp;
          <span className="icon-[mdi--camera-control]" />
        </button>

        <SurfaceViewButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />

        <SpaceViewButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />
      </div>
    </div>
  );
});

export { DetailsPanel };
