import { type ClassNameValue } from 'tailwind-merge';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/cn';
import { SurfaceViewDialog } from './SurfaceViewDialog';
import { useCallback, useContext } from 'react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { observer } from 'mobx-react-lite';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

type Props = {
  children?: React.ReactNode;
  className?: ClassNameValue;
  defaultOpen?: boolean;
};
const SurfaceViewButton = observer(
  ({ children, className, defaultOpen }: Props) => {
    const { uiService, cameraService, selectionService } =
      useContext(GlobalStateContext);

    const selected = useSelector(
      selectionService,
      ({ context }) => context.selected
    );

    const handleClick = useCallback(() => {
      // cameraState.setFocus(uiState.getSelected()!);
      cameraService.send({
        type: 'SET_TARGET',
        focusTarget: selected,
      });
    }, [cameraService, selected]);

    return (
      <AlertDialog.Root defaultOpen={defaultOpen ?? false}>
        {/** Button to trigger dialog box popup. */}
        <AlertDialog.Trigger asChild>
          {/** Surface view button. */}
          <button
            onClick={handleClick}
            className={cn(
              'pointer-events-auto flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 font-sans hover:bg-subtle hover:text-subtle-foreground',
              className
            )}
          >
            Surface&nbsp;
            <span className="icon-[mdi--telescope]" />
          </button>
        </AlertDialog.Trigger>

        <SurfaceViewDialog />
      </AlertDialog.Root>
    );
  }
);

export { SurfaceViewButton };
