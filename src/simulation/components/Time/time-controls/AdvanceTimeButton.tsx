import { cn } from '@/lib/cn';
import KeplerBody from '@/simulation/classes/kepler-body';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { useCallback } from 'react';
import { ClassNameValue } from 'tailwind-merge';

type Props = {
  reverse?: boolean;
  className?: ClassNameValue;
};
export const AdvanceTimeButton = ({ reverse, className }: Props) => {
  const rootActor = MachineContext.useActorRef();
  const { timeActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const handleClick = useCallback(() => {
    // Advance time by the sidereal rotation period of the reference body. This way, the body will maintain its orientation relative to the fixed stars.
    const { focusTarget } = cameraActor.getSnapshot()!.context;
    if (!(focusTarget instanceof KeplerBody)) return;

    let deltaTime = focusTarget.siderealRotationPeriod;
    reverse && (deltaTime *= -1);
    rootActor.send({
      type: 'ADVANCE_TIME',
      deltaTime,
    });
  }, [cameraActor, reverse, rootActor]);
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
