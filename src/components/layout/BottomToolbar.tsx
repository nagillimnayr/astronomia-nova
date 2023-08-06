import { cn } from '@/lib/cn';
import { ToggleBar } from '@/simulation/components/HUD/ToggleBar/ToggleBar';
import { OpacitySliders } from '@/simulation/components/HUD/opacity/OpacitySliders';
import { MachineContext } from '@/state/xstate/MachineProviders';

const BottomToolbar = () => {
  const { uiActor, cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  return (
    <div
      className={cn(
        'grid h-full w-full grid-cols-[100px_minmax(300px,_1fr)_minmax(300px,_1fr)_minmax(300px,_1fr)_100px] grid-rows-1 place-items-center border bg-muted'
      )}
    >
      <div className="col-span-1 col-start-3 flex h-full w-full items-center justify-center">
        <OpacitySliders />
      </div>

      <div className="col-span-1 col-end-[-2] flex h-full w-full items-center justify-center">
        <ToggleBar />
      </div>
    </div>
  );
};

export { BottomToolbar };
