import KeplerBody from '@/simulation/classes/KeplerBody';
import { MutableRefObject, useCallback } from 'react';
import { useSelectionStore } from '@/simulation/state/zustand/selection-store';
import { useFloating } from '@floating-ui/react';
import { Separator } from '@/components/gui/Separator';
import { useCameraStore } from '@/simulation/state/zustand/camera-store';

export function DetailsPanel() {
  const body = useSelectionStore((state) => state.selected);

  const handleCloseClick = useCallback(() => {
    useSelectionStore.getState().deselect();
  }, []);

  const handleFocusClick = useCallback(() => {
    if (!body) return;
    // Focus camera on selection.
    useCameraStore.getState().setFocus(body);
  }, [body]);

  if (!body) return null; // If nothing selected, display nothing.
  return (
    <div className="absolute right-0 top-0 flex h-80 w-60 flex-col items-center justify-start gap-2 rounded-sm border bg-muted p-4 text-muted-foreground">
      {/** Close button. */}
      <button className="absolute right-0 top-0 h-fit w-fit p-1">
        <span
          onClick={handleCloseClick}
          className="icon-[mdi--close-box-outline] pointer-events-auto aspect-square text-xl text-muted-foreground transition-opacity hover:cursor-pointer hover:opacity-75"
        />
      </button>

      {/** Name. */}
      <header className="flex w-full flex-row items-center justify-center">
        <h4 className="text-xl">{body.name}</h4>
      </header>
      <Separator className="w-full bg-border" />
      {/** Attributes. */}
      <div className="h-full max-h-full w-full overflow-auto whitespace-nowrap border p-1">
        {/** Mass. */}
        <div className="flex w-full flex-col items-start justify-start">
          <span>
            Mass:&nbsp;<span>{}</span>
          </span>
          {/** Radius. */}
          <span>
            Mean radius:&nbsp;<span>{}</span>
          </span>
        </div>
      </div>

      <div className="mt-auto flex w-full flex-row items-start justify-start">
        {/** Camera focus button. */}
        <button
          onClick={handleFocusClick}
          className="pointer-events-auto flex flex-row items-center justify-center rounded-md border px-2 py-1 hover:bg-subtle hover:text-subtle-foreground"
        >
          Focus&nbsp;
          <span className="icon-[mdi--camera-control]" />
        </button>
      </div>
    </div>
  );
}
