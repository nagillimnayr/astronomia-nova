import { Separator } from '@/components/gui/Separator';
import { SettingsToggleButton } from './SettingsToggleButton';
import { OpacitySliders } from '../opacity/OpacitySliders';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useActor, useSelector } from '@xstate/react';
import { useCallback } from 'react';

export const SettingsMenu = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  const settingsMenuActor = useSelector(
    uiActor,
    ({ context }) => context.settingsMenuActor
  );

  const [state] = useActor(settingsMenuActor);

  const handleCloseClick = useCallback(() => {
    settingsMenuActor.send({ type: 'CLOSE' });
  }, [settingsMenuActor]);
  return (
    <>
      <div
        data-state={state.value}
        className={
          'items-left relative flex min-h-fit min-w-fit flex-col justify-start gap-2 overflow-y-hidden rounded-lg border-2 bg-muted p-3 font-sans text-xl text-muted-foreground transition-opacity duration-300 data-[state=closed]:pointer-events-none data-[state=open]:pointer-events-auto data-[state=closed]:opacity-0'
        }
      >
        {/** Close button. */}
        <button
          data-state={state.value}
          onClick={handleCloseClick}
          className="absolute right-0 top-0 h-fit w-fit p-1 data-[state=closed]:pointer-events-none data-[state=open]:pointer-events-auto"
        >
          <span className="icon-[mdi--close-box-outline]  aspect-square text-xl text-muted-foreground transition-colors hover:text-yellow-400 " />
        </button>
        <div className="h-fit w-full">
          <span>Settings</span>
        </div>
        <Separator />
        {/** Visibility Toggles */}
        {/** Trajectories */}
        <div className="flex h-fit w-full flex-row items-center justify-start gap-2">
          <SettingsToggleButton target={'trajectories'}>
            <span className="icon-[mdi--orbit]" />
          </SettingsToggleButton>
          <span>Trajectories</span>
        </div>
        {/** Annotations */}
        <div className="flex h-fit w-full flex-row items-center justify-start gap-2">
          <SettingsToggleButton target={'annotations'}>
            <span className="icon-[mdi--tag-text]" />
          </SettingsToggleButton>
          <span>Annotations</span>
        </div>
        {/** Markers */}
        <div className="flex h-fit w-full flex-row items-center justify-start gap-2">
          <SettingsToggleButton target={'markers'}>
            <span className="icon-[mdi--target]" />
          </SettingsToggleButton>
          <span>Markers</span>
        </div>
        {/** Velocity Arrows */}
        <div className="flex h-fit w-full flex-row items-center justify-start gap-2">
          <SettingsToggleButton target={'velocityArrows'} defaultOff>
            <span className="icon-[mdi--arrow-top-right-thin]" />
          </SettingsToggleButton>
          <span>Velocity Arrows</span>
        </div>
        <Separator />
        {/** Opacity Sliders */}
        <OpacitySliders direction="vertical" />
        {/**  */}
      </div>
    </>
  );
};
