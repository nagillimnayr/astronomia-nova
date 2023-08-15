import { Separator } from '@/components/gui/Separator';
import { SettingsToggleButton } from './SettingsToggleButton';
import { OpacitySliders } from '../opacity/OpacitySliders';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useActor, useSelector, useMachine } from '@xstate/react';
import { useCallback, useEffect, useRef } from 'react';
import { dialogMachine } from '@/state/xstate/ui-machine/dialog-machine/dialog-machine';
import { cn } from '@/lib/cn';

type Props = {
  defaultOpen?: boolean;
};
export const SettingsMenu = ({ defaultOpen }: Props) => {
  const divRef = useRef<HTMLDivElement>(null!);

  // Use state machine.
  const [state, send, actor] = useMachine(dialogMachine);

  // Open button click handler.
  const handleOpenClick = useCallback(() => {
    actor.send({ type: 'TOGGLE' });
  }, [actor]);

  // Close button click handler.
  const handleCloseClick = useCallback(() => {
    actor.send({ type: 'CLOSE' });
  }, [actor]);

  useEffect(() => {
    // If ref has not already been set in the actor's context. Set it.
    const dialogRef = actor.getSnapshot()!.context.dialogRef;
    if (!dialogRef) {
      actor.send({ type: 'SET_REF', ref: divRef });
    }
  }, [actor]);

  useEffect(() => {
    if (defaultOpen) {
      handleOpenClick();
    }
  }, [defaultOpen, handleOpenClick]);

  return (
    <>
      {/** Open button. */}

      <button
        className="pointer-events-auto relative right-0 top-0 m-0 inline-flex items-center justify-center rounded-full bg-clip-text p-0"
        onClick={handleOpenClick}
      >
        <span className="icon-[mdi--cog] text-4xl text-gray-200/30 transition-colors  hover:text-gray-200/50" />
      </button>

      <div
        ref={divRef}
        data-state={state.value}
        className={cn(
          'items-left w-50 absolute  right-full top-full m-0 flex min-h-fit min-w-fit flex-col justify-start gap-2 rounded-lg border-2 bg-muted p-3 font-sans text-xl text-muted-foreground data-[state=closed]:pointer-events-none data-[state=open]:pointer-events-auto data-[state=closed]:hidden '
        )}
      >
        {/** Close button. */}
        <button
          onClick={handleCloseClick}
          className="absolute right-0 top-0 h-fit w-fit p-1"
        >
          <span className="icon-[mdi--close-box-outline]  aspect-square text-xl text-muted-foreground transition-colors hover:text-yellow-400 " />
        </button>
        <div className="h-fit w-full min-w-fit">
          <span>Settings</span>
        </div>
        <Separator />
        {/** Visibility Toggles */}
        {/** Trajectories */}
        <div className="flex h-fit w-full min-w-fit flex-row items-center justify-start gap-2">
          <SettingsToggleButton target={'trajectories'}>
            <span className="icon-[mdi--orbit]" />
          </SettingsToggleButton>
          <span className={'min-w-fit whitespace-nowrap'}>Trajectories</span>
        </div>
        {/** Annotations */}
        <div className="flex h-fit w-full min-w-fit flex-row items-center justify-start gap-2">
          <SettingsToggleButton target={'annotations'}>
            <span className="icon-[mdi--tag-text]" />
          </SettingsToggleButton>
          <span className={'min-w-fit whitespace-nowrap'}>Annotations</span>
        </div>
        {/** Markers */}
        <div className="flex h-fit w-full min-w-fit flex-row items-center justify-start gap-2">
          <SettingsToggleButton target={'markers'}>
            <span className="icon-[mdi--target]" />
          </SettingsToggleButton>
          <span className={'min-w-fit whitespace-nowrap'}>Markers</span>
        </div>
        {/** Velocity Arrows */}
        <div className="flex h-fit w-full min-w-fit flex-row items-center justify-start gap-2">
          <SettingsToggleButton target={'velocityArrows'} defaultOff>
            <span className="icon-[mdi--arrow-top-right-thin]" />
          </SettingsToggleButton>
          <span className={'min-w-fit whitespace-nowrap'}>Velocity Arrows</span>
        </div>
        <Separator />
        {/** Opacity Sliders */}
        <OpacitySliders direction="vertical" />
        {/**  */}
      </div>
    </>
  );
};
