import { useCallback, useEffect, useRef } from 'react';
import { Separator } from '@/components/dom/ui/Separator';
import { SurfaceViewButton } from '../surface-dialog/SurfaceViewButton';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { HOUR } from '@/constants/constants';
import { useMachine, useSelector } from '@xstate/react';
import { KeplerOrbit } from '@/components/canvas/orbit/kepler-orbit';
import { SpaceViewButton } from '../surface-dialog/SpaceViewButton';
import { cn } from '@/helpers/cn';
import { FocusButton } from './FocusButton';
import { gsap } from 'gsap';
import { dialogMachine } from '@/state/xstate/ui-machine/dialog-machine/dialog-machine';
import { AttributeDetails } from './AttributeDetails';

const DetailsPanel = () => {
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
      {selected && (
        <>
          <div className="h-full max-h-full w-full overflow-auto whitespace-nowrap border p-1">
            <div className="flex w-full flex-col items-start justify-start gap-1">
              {/** Mass. */}
              <AttributeDetails name={'Mass'}>
                {selected.mass.toExponential(3) + ' kg'}
              </AttributeDetails>
              {/** Radius. */}
              <AttributeDetails name={'Mean Radius'}>
                {selected.meanRadius.toExponential(3) + ' m'}
              </AttributeDetails>
              {/** Sidereal Rotation Rate. */}
              <AttributeDetails name={'Sidereal Rotation Rate'}>
                {selected.siderealRotationRate.toExponential(3) + ' rad/s'}
              </AttributeDetails>
              {/** Sidereal Rotation Period. */}
              <AttributeDetails name={'Sidereal Rotation Period'}>
                {(selected.siderealRotationPeriod / HOUR).toLocaleString() +
                  ' hr'}
              </AttributeDetails>
            </div>
            <div className="flex w-full flex-col items-start justify-start"></div>
          </div>
        </>
      )}
      <div className="mt-auto flex w-full flex-row items-start justify-between">
        {/** Camera focus button. */}
        <FocusButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />

        <SurfaceViewButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />

        <SpaceViewButton className="flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 hover:bg-subtle hover:text-subtle-foreground" />
      </div>
    </div>
  );
};

export { DetailsPanel };
