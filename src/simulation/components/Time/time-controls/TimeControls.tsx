import { timeState } from '@/simulation/state/TimeState';
import { Slider } from '@/components/gui/Slider';
import { TimescaleSlider } from './TimescaleSlider';
import BackwardButton from './buttons/BackwardButton';
import DecreaseButton from './buttons/DecreaseButton';
import ForwardButton from './buttons/ForwardButton';
import IncreaseButton from './buttons/IncreaseButton';
import PauseButton from './buttons/PauseButton';
import Icon from '@mdi/react';
import { mdiMenuLeft } from '@mdi/js';

const TimeControls = () => {
  return (
    <>
      <div className="pointer-events-auto mt-2 flex w-40 flex-row justify-center self-center ">
        <PauseButton />
      </div>

      <div className="bg-translucent pointer-events-auto my-2 box-content flex w-48 min-w-fit flex-row items-center justify-center self-center rounded-full border-2 px-1 py-1">
        <DecreaseButton />

        <button
          className="translate-x-1"
          onClick={(e) => {
            e.stopPropagation();
            timeState.decrementTimescale();
          }}
        >
          <Icon path={mdiMenuLeft} size={1} />
        </button>

        <div className="mx-2 border-2">
          <TimescaleSlider />
        </div>
        <IncreaseButton />
      </div>
    </>
  );
};

export default TimeControls;
