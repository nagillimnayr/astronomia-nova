import { Slider } from '@/components/gui/Slider';
import { TimescaleSlider } from './TimescaleSlider';

import PauseButton from './PauseButton';
import Icon from '@mdi/react';
import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useContext } from 'react';
import { useSelector } from '@xstate/react';

const TimeControls = () => {
  const { rootActor } = useContext(GlobalStateContext);
  const timeActor = useSelector(rootActor, ({ context }) => context.timeActor);
  // get state without subscribing
  // const { incrementTimescale, decrementTimescale } = useTimeStore.getState();
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="pointer-events-auto mt-2 flex aspect-square w-fit flex-row justify-center self-center rounded-full border-none bg-gray-400/20 transition-colors hover:bg-gray-400/30">
        <PauseButton />
      </div>

      <div className="pointer-events-auto my-2 box-content flex w-48 min-w-fit flex-row items-center justify-center self-center rounded-full  bg-gray-400/20  px-1 py-1">
        <button
          className="translate-x-1"
          onClick={(e) => {
            e.stopPropagation();
            timeActor.send({ type: 'DECREMENT_TIMESCALE' });
          }}
        >
          <Icon path={mdiMenuLeft} size={1} />
        </button>

        <div className="mx-2">
          <TimescaleSlider />
        </div>

        <button
          className="translate-x-1"
          onClick={(e) => {
            e.stopPropagation();
            timeActor.send({ type: 'INCREMENT_TIMESCALE' });
          }}
        >
          <Icon path={mdiMenuRight} size={1} />
        </button>
      </div>
    </div>
  );
};

export default TimeControls;
