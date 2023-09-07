import { MachineContext } from '@/state/xstate/MachineProviders';
import { useCallback } from 'react';
import { ClassNameValue } from 'tailwind-merge';
import { useSelector } from '@xstate/react';
import { cn } from '@/helpers/cn';

type Props = {
  children?: React.ReactNode;
  className?: ClassNameValue;
};

export const SpaceViewButton = ({ children, className }: Props) => {
  const { cameraActor, visibilityActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Only show button when in surface view.
  const inSurfaceView = useSelector(cameraActor, (state) =>
    state.matches('surface')
  );
  const trajectories = useSelector(
    visibilityActor,
    ({ context }) => context.trajectories
  );

  // Go to space view on click
  const handleClick = useCallback(() => {
    cameraActor.send({
      type: 'TO_SPACE',
    });
    trajectories.send({ type: 'ENABLE' });
  }, [cameraActor]);

  return inSurfaceView ? (
    <>
      <button
        onClick={handleClick}
        data-state={inSurfaceView ? 'shown' : 'hidden'}
        className={cn(
          'pointer-events-auto flex flex-row items-center justify-center rounded-md border-2 px-2 py-1 font-sans hover:bg-subtle hover:text-subtle-foreground data-[state=hidden]:hidden',
          className
        )}
      >
        Space&nbsp;
        <span className="icon-[mdi--telescope]" />
      </button>
    </>
  ) : null;
};
