import KeplerBody from '@/simulation/classes/KeplerBody';
import { MutableRefObject, useCallback } from 'react';
import { useSelectionStore } from '@/simulation/state/zustand/selection-store';
import { useFloating } from '@floating-ui/react';

export function DetailsPanel() {
  const body = useSelectionStore((state) => state.selected);

  const handleCloseClick = useCallback(() => {
    useSelectionStore.getState().deselect();
  }, []);

  if (!body) return null; // If nothing selected, display nothing.
  return (
    <div className="absolute right-0 top-0 flex h-80 w-60 flex-col items-center justify-start gap-2 rounded-sm border bg-muted p-2 text-muted-foreground">
      {/** Close button. */}
      <button className="absolute right-0 top-0 h-fit w-fit p-1">
        <span
          onClick={handleCloseClick}
          className="icon-[mdi--close-box-outline] pointer-events-auto aspect-square text-xl text-muted-foreground transition-opacity hover:cursor-pointer hover:opacity-75"
        />
      </button>

      <header className="flex w-full flex-row items-center justify-center">
        <h4 className="text-xl">{body.name}</h4>
      </header>
      <div className="flex w-full flex-col items-start justify-start">
        <span>
          Mass:&nbsp;<span>{}</span>
        </span>
        <span>
          Mean radius:&nbsp;<span>{}</span>
        </span>
      </div>
    </div>
  );
}
