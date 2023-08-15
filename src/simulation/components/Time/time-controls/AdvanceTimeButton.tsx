import { cn } from '@/lib/cn';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useCallback } from 'react';
import { type ClassNameValue } from 'tailwind-merge';

type Props = {
  reverse?: boolean;
  className?: ClassNameValue;
};
export const AdvanceTimeButton = ({ reverse, className }: Props) => {
  const rootActor = MachineContext.useActorRef();

  const handleClick = useCallback(() => {
    // Advance time by the sidereal rotation period of the reference body. This way, the body will maintain its orientation relative to the fixed stars.

    rootActor.send({
      type: 'ADVANCE_DAY',
      reverse,
    });
  }, [reverse, rootActor]);
  return (
    <>
      <button
        className={cn(
          'p- inline-flex aspect-square items-center justify-center rounded-full border-2',
          className
        )}
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
