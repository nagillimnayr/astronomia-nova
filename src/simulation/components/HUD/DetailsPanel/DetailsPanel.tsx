import { useCallback, useContext, useEffect, useRef } from 'react';
import { Separator } from '@/components/gui/Separator';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { observer } from 'mobx-react-lite';
import { SurfaceViewButton } from './surface-view-dialog/SurfaceViewButton';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { DIST_MULT } from '@/simulation/utils/constants';
import { useSelector, useMachine } from '@xstate/react';
import { KeplerOrbit } from '@/simulation/classes/kepler-orbit';
import { SpaceViewButton } from './surface-view-dialog/SpaceViewButton';
import { cn } from '@/lib/cn';
import { FocusButton } from './FocusButton';
import { TracePathButton } from './TracePathButton';
import { gsap } from 'gsap';
import { dialogMachine } from '@/state/xstate/ui-machine/dialog-machine/dialog-machine';

const DetailsPanel = observer(() => {
  const { selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  const divRef = useRef<HTMLDivElement>(null!);

  const openDialog = useCallback(() => {
    return new Promise((resolve) => {
      const div = divRef.current;
      gsap.to(div, {
        duration: 0.3,
        opacity: '100%',
        ease: 'power2.in',
        onComplete: resolve,
      });
    });
  }, []);
  const closeDialog = useCallback(() => {
    return new Promise((resolve) => {
      const div = divRef.current;
      gsap.to(div, {
        duration: 0.3,
        opacity: 0,
        ease: 'power3.inOut',
        onComplete: () => {
          // Deselect.
          setTimeout(() => {
            selectionActor.send('DESELECT');
            resolve(null);
          }, 300);
        },
      });
    });
  }, [selectionActor]);
  const [state, send, actor] = useMachine(dialogMachine, {
    services: {
      openDialog,
      closeDialog,
    },
  });

  useEffect(() => {
    // If ref has not already been set in the actor's context. Set it.
    const dialogRef = actor.getSnapshot()!.context.dialogRef;
    if (!dialogRef) {
      actor.send({ type: 'SET_REF', ref: divRef });
    }
  }, [actor]);

  // Close button click handler.
  const handleCloseClick = useCallback(() => {
    actor.send({ type: 'CLOSE' });
  }, [actor]);

  useEffect(() => {
    if (selected && state.matches('closed')) {
      actor.send({ type: 'OPEN' });
    }
  }, [actor, selected, state]);

  // if (!selected) return null; // If nothing is selected, display nothing.
  let orbit: KeplerOrbit | null = null;
  if (selected?.parent instanceof KeplerOrbit) {
    orbit = selected.parent;
  }

  return (
    <div
      ref={divRef}
      data-state={state.value}
      className={cn(
        'relative flex h-80 w-60 flex-col items-center justify-start gap-2 rounded-sm border bg-muted p-4 text-muted-foreground',
        'transition-all duration-300 data-[state=closed]:hidden'
      )}
    >
      {/** Close button. */}
      <button
        className="group pointer-events-auto absolute right-0 top-0 mr-1 mt-1 inline-flex h-fit w-fit items-center justify-center p-0 transition-colors hover:cursor-pointer hover:text-yellow-400"
        onClick={handleCloseClick}
      >
        <span className="icon-[mdi--close-box-outline] aspect-square text-xl text-muted-foreground transition-colors group-hover:text-yellow-400 " />
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

      <div className="mt-auto flex w-full flex-row items-start justify-between">
        {/** Camera focus button. */}
        <FocusButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />

        <TracePathButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />

        <SurfaceViewButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />

        <SpaceViewButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />
      </div>
    </div>
  );
});

export { DetailsPanel };
