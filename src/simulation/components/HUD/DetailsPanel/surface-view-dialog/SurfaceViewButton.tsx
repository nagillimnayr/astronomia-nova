import { type ClassNameValue } from 'tailwind-merge';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import { cn } from '@/lib/cn';

type Props = {
  children?: React.ReactNode;
  className?: ClassNameValue;
};
const SurfaceViewButton = ({ children, className }: Props) => {
  return (
    <AlertDialog.Root>
      {/** Button to trigger dialog box popup. */}
      <AlertDialog.Trigger asChild>
        {/** Surface view button. */}
        <button className={cn('pointer-events-auto', className)}>
          Surface&nbsp;
          <span className="icon-[mdi--telescope]" />
        </button>
      </AlertDialog.Trigger>

      {/** Portal to display the dialog popup outside of the parent component. */}
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed left-1/2 top-1/2 grid h-60 w-96 max-w-[50vw] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-card">
          <AlertDialog.Title></AlertDialog.Title>
          <AlertDialog.Description></AlertDialog.Description>
          <AlertDialog.Content className="grid grid-cols-5">
            {/** Cancel button. */}
            <AlertDialog.Cancel asChild>
              <button className="col-span-1 col-start-2 w-16 place-items-center border">
                Cancel
              </button>
            </AlertDialog.Cancel>
            {/** Confirm button. */}
            <AlertDialog.Action asChild>
              <button className="col-span-1 col-end-[-2] w-16 ">Confirm</button>
            </AlertDialog.Action>
          </AlertDialog.Content>
        </AlertDialog.Overlay>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
};

export { SurfaceViewButton };
