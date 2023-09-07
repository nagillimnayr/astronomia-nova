import { MachineContext } from '@/state/xstate/MachineProviders';
import { useCallback } from 'react';
import { ClassNameValue } from 'tailwind-merge';
import { useSelector } from '@xstate/react';
import { cn } from '@/helpers/cn';

type Props = {
  children?: React.ReactNode;
  className?: ClassNameValue;
};

export const FocusButton = ({ children, className }: Props) => {
  const { cameraActor, selectionActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const selected = useSelector(
    selectionActor,
    ({ context }) => context.selected
  );

  // Go to space view on click
  const handleClick = useCallback(() => {
    // Focus camera on selection.
    cameraActor.send({
      type: 'SET_TARGET',
      focusTarget: selected,
    });
  }, [cameraActor, selected]);

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'pointer-events-auto flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 font-sans hover:bg-subtle hover:text-subtle-foreground',
          className
        )}
      >
        Focus&nbsp;
        <span className="icon-[mdi--camera-control]" />
      </button>
    </>
  );
};
