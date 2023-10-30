import { MachineContext } from '@/state/xstate/MachineProviders';
import { AdvanceTimeButton } from './AdvanceTimeButton';
import { PauseButton } from './PauseButton';

export const TimeControls = () => {
  // const { timeActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="  pointer-events-auto my-1  flex w-fit flex-row items-center justify-center gap-2 self-center rounded-full">
        <AdvanceTimeButton
          reverse
          className={
            'w-8 bg-gray-400/20 text-3xl transition-colors hover:bg-gray-500/50'
          }
        />
        <PauseButton
          className={
            'w-8 bg-gray-400/20 text-3xl transition-colors hover:bg-gray-500/50'
          }
        />
        <AdvanceTimeButton
          className={
            'w-8 bg-gray-400/20 text-3xl transition-colors hover:bg-gray-500/50'
          }
        />
      </div>
    </div>
  );
};
