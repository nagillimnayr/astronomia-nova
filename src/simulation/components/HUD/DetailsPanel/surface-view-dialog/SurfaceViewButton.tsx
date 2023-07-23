import { type ClassNameValue } from 'tailwind-merge';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/cn';
import { SurfaceViewDialog } from './SurfaceViewDialog';
import { useContext } from 'react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { observer } from 'mobx-react-lite';

type Props = {
  children?: React.ReactNode;
  className?: ClassNameValue;
};
const SurfaceViewButton = observer(({ children, className }: Props) => {
  const { uiState } = useContext(RootStoreContext);
  return (
    <AlertDialog.Root>
      {/** Button to trigger dialog box popup. */}
      <AlertDialog.Trigger asChild>
        {/** Surface view button. */}
        <button
          className={cn(
            'pointer-events-auto flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 font-sans hover:bg-subtle hover:text-subtle-foreground',
            className
          )}
        >
          Surface&nbsp;
          <span className="icon-[mdi--telescope]" />
        </button>
      </AlertDialog.Trigger>

      {/** Portal to display the dialog popup outside of the parent component. */}
      <AlertDialog.Portal container={uiState.screenPortal}>
        <SurfaceViewDialog />
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
});

export { SurfaceViewButton };
