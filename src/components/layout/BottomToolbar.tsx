import { cn } from '@/lib/cn';
import { ToggleBar } from '@/simulation/components/HUD/ToggleBar/ToggleBar';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useContext } from 'react';

const BottomToolbar = () => {
  const { uiService, cameraService, selectionService } =
    useContext(GlobalStateContext);

  return (
    <div
      className={cn(
        'grid h-full w-full grid-cols-[100px_minmax(300px,_1fr)_minmax(300px,_1fr)_minmax(300px,_1fr)_100px] grid-rows-1 place-items-center border bg-muted'
      )}
    >
      <div className="col-span-1 col-start-2 flex h-full w-full items-center justify-center">
        <button
          className="rounded-md border px-2 py-1 text-lg transition-colors hover:bg-subtle"
          onClick={() => {
            cameraService.send('TO_SPACE');
          }}
        >
          Space
        </button>
      </div>
      <div className="col-span-1 col-end-[-2] flex h-full w-full items-center justify-center">
        <ToggleBar />
      </div>
    </div>
  );
};

export { BottomToolbar };
