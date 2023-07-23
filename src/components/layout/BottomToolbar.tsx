import { cn } from '@/lib/cn';
import { Toolbar } from '@/simulation/components/HUD/Toolbar/Toolbar';

const BottomToolbar = () => {
  return (
    <div
      className={cn(
        'grid h-full w-full grid-cols-[100px_minmax(300px,_1fr)_minmax(300px,_1fr)_minmax(300px,_1fr)_100px] grid-rows-1 place-items-center border bg-muted'
      )}
    >
      <div className="col-span-1 col-end-[-2] flex h-full w-full items-center justify-center">
        <Toolbar />
      </div>
    </div>
  );
};

export { BottomToolbar };
