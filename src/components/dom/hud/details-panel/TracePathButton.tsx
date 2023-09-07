import { MachineContext } from '@/state/xstate/MachineProviders';
import { useCallback } from 'react';
import { ClassNameValue } from 'tailwind-merge';
import { useSelector } from '@xstate/react';
import { cn } from '@/helpers/cn';

type Props = {
  children?: React.ReactNode;
  className?: ClassNameValue;
};

export const TracePathButton = ({ children, className }: Props) => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  // Only show button when in surface view.
  const inSurfaceView = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );

  // Go to space view on click
  const handleClick = useCallback(() => {
    //
  }, []);

  return inSurfaceView ? (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'pointer-events-auto flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 font-sans hover:bg-subtle hover:text-subtle-foreground',
          className
        )}
      >
        Trace Path&nbsp;
        <span className="icon-[ph--path-fill]" />
      </button>
    </>
  ) : null;
};
