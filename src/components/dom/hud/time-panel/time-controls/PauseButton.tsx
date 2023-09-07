import { MachineContext } from '@/state/xstate/MachineProviders';
import { useSelector } from '@xstate/react';
import { cn } from '@/helpers/cn';
import { type ClassNameValue } from 'tailwind-merge';

type Props = {
  className?: ClassNameValue;
};
const PauseButton = ({ className }: Props) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  // Check whether paused or not.
  const isPaused = useSelector(timeActor, (state) => state.matches('paused'));

  return (
    <button
      className={cn(
        'inline-flex aspect-square items-center justify-center rounded-full p-1',
        className
      )}
      onClick={(e) => {
        e.stopPropagation();

        timeActor.send(isPaused ? 'UNPAUSE' : 'PAUSE');
      }}
    >
      <span
        className={cn(
          'h-full w-full rounded-full',
          isPaused ? 'icon-[mdi--play]' : 'icon-[mdi--pause]'
        )}
      />
    </button>
  );
};

export default PauseButton;
