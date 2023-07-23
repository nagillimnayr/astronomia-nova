import { useCallback, useContext } from 'react';
import { Separator } from '@/components/gui/Separator';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { observer } from 'mobx-react-lite';
import { SurfaceViewButton } from './surface-view-dialog/SurfaceViewButton';

const DetailsPanel = observer(() => {
  const { uiState, cameraState } = useContext(RootStoreContext);

  const handleCloseClick = useCallback(() => {
    // Deselect selected object.
    uiState.deselect();
  }, [uiState]);

  const handleFocusClick = useCallback(() => {
    // Focus camera on selection. We can be certain that its not null because the button won't be clickable if the selection is null.
    cameraState.setFocus(uiState.getSelected()!);
  }, [cameraState, uiState]);

  if (!uiState.selected) return null; // If nothing is selected, display nothing.
  return (
    <div className="absolute right-0 top-0 flex h-80 w-60 flex-col items-center justify-start gap-2 rounded-sm border bg-muted p-4 text-muted-foreground">
      {/** Close button. */}
      <button className="absolute right-0 top-0 h-fit w-fit p-1">
        <span
          onClick={handleCloseClick}
          className="icon-[mdi--close-box-outline] pointer-events-auto aspect-square text-xl text-muted-foreground transition-colors hover:cursor-pointer hover:text-yellow-400 "
        />
      </button>

      {/** Name. */}
      <header className="flex w-full flex-row items-center justify-center">
        <h4 className="text-xl">{uiState.selected.name}</h4>
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
      </div>
    </div>
  );
});

export { DetailsPanel };
