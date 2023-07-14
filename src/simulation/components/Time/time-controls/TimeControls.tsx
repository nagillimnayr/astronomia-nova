import { timeState } from '@/simulation/state/TimeState';
import { Slider } from '@/components/gui/Slider';
import { TimescaleSlider } from './TimescaleSlider';
import BackwardButton from './buttons/BackwardButton';
import DecreaseButton from './buttons/DecreaseButton';
import ForwardButton from './buttons/ForwardButton';
import IncreaseButton from './buttons/IncreaseButton';
import PauseButton from './buttons/PauseButton';
import Icon from '@mdi/react';
import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
import { useTimeStore } from '@/simulation/state/zustand/time-store';

const TimeControls = () => {
  // get state without subscribing
  const { incrementTimescale, decrementTimescale } = useTimeStore.getState();
  return (
    <div className="flex flex-col items-center justify-start border-2">
      <div className="pointer-events-auto mt-2 flex w-40 flex-row justify-center self-center border-2">
        <PauseButton />
      </div>

      <div className="bg-translucent pointer-events-auto my-2 box-content flex w-48 min-w-fit flex-row items-center justify-center self-center rounded-full border-2 px-1 py-1">
        <button
          className="translate-x-1"
          onClick={(e) => {
            e.stopPropagation();
            // timeState.decrementTimescale();
            decrementTimescale();
          }}
        >
          <Icon path={mdiMenuLeft} size={1} />
        </button>

        <div className="mx-2 border-2">
          <TimescaleSlider />
        </div>

        <button
          className="translate-x-1"
          onClick={(e) => {
            e.stopPropagation();
            // timeState.incrementTimescale();
            incrementTimescale();
          }}
        >
          <Icon path={mdiMenuRight} size={1} />
        </button>
      </div>
    </div>
  );
};

export default TimeControls;
