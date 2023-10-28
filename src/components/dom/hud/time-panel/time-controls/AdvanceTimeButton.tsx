import { cn } from '@/helpers/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useCallback } from 'react';
import { type ClassNameValue } from 'tailwind-merge';
import { useSelector } from '@xstate/react';

type Props = {
  reverse?: boolean;
  className?: ClassNameValue;
};
export const AdvanceTimeButton = ({ reverse, className }: Props) => {
  const rootActor = MachineContext.useActorRef();
  const { cameraActor, timeActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  const handleClick = useCallback(() => {
    const { focusTarget } = cameraActor.getSnapshot()!.context;
    if (!focusTarget) return;
    /* Advance time by the sidereal rotation period of the reference body. 
    This way, the body will maintain its orientation relative to the fixed stars. */
    rootActor.send({
      type: 'ADVANCE_DAY',
      reverse,
    });
  }, [cameraActor, reverse, rootActor]);

  return (
    <>
      <button
        className={cn(
          'inline-flex aspect-square items-center justify-center rounded-full border-2 border-border',
          className,
          'disabled:text-opacity-25'
        )}
        disabled={!focusTarget}
        onClick={handleClick}
      >
        <span
          className={cn(
            ' inline-flex h-full w-full items-center justify-center',
            reverse
              ? 'icon-[mdi--clock-minus-outline]'
              : 'icon-[mdi--clock-plus-outline]'
          )}
        />
      </button>
    </>
  );
};
