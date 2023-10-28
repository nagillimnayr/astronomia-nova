import { MachineContext } from '@/state/xstate/MachineProviders';
import { TimescaleSlider } from './TimescaleSlider';
import { useCallback, type MouseEvent } from 'react';

export const TimescaleControls = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  const incrementTimescale = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      timeActor.send({ type: 'INCREMENT_TIMESCALE' });
    },
    [timeActor]
  );

  const decrementTimescale = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      timeActor.send({ type: 'DECREMENT_TIMESCALE' });
    },
    [timeActor]
  );
  return (
    <div className="pointer-events-auto my-2  flex h-fit w-full min-w-full flex-row  items-center justify-center self-center whitespace-nowrap px-2">
      <button
        className={
          'icon-[mdi--menu-left] ml-2 mr-auto inline-flex aspect-square h-6 w-6 items-center justify-center rounded-full p-0'
        }
        onClick={decrementTimescale}
      />

      <div className="mx-2 flex w-full items-center justify-center">
        <TimescaleSlider />
      </div>

      <button
        className={
          'icon-[mdi--menu-right] ml-auto mr-2 inline-flex aspect-square h-6 w-6 items-center justify-center rounded-full p-0'
        }
        onClick={incrementTimescale}
      ></button>
    </div>
  );
};
