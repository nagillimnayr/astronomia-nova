import { type ClassNameValue } from 'tailwind-merge';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/cn';
import { SurfaceViewDialog } from './SurfaceViewDialog';
import { useCallback, useContext } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';

type Props = {
  children?: React.ReactNode;
  className?: ClassNameValue;
  defaultOpen?: boolean;
};
export const SurfaceViewButton = ({
  children,
  className,
  defaultOpen,
}: Props) => {
  const { uiActor, cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const { surfaceDialogActor } = useSelector(uiActor, ({ context }) => context);

  // Get selection.
  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  // Only show button when in space view.
  const inSpaceView = useSelector(cameraActor, (state) =>
    state.matches('space')
  );

  const handleClick = useCallback(() => {
    // cameraState.setFocus(uiState.getSelected()!);
    cameraActor.send({
      type: 'SET_TARGET',
      focusTarget: selected,
    });
    surfaceDialogActor.send({ type: 'TOGGLE' });
  }, [cameraActor, selected, surfaceDialogActor]);

  return (
    <AlertDialog.Root defaultOpen={defaultOpen ?? false}>
      {/** Button to trigger dialog box popup. */}
      {inSpaceView ? (
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
      ) : null}

      <SurfaceViewDialog />
    </AlertDialog.Root>
  );
};
