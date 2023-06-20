import { Slider } from '../../../components/gui/Slider';
import { TimescaleSlider } from './TimescaleSlider';
import BackwardButton from './buttons/BackwardButton';
import DecreaseButton from './buttons/DecreaseButton';
import ForwardButton from './buttons/ForwardButton';
import IncreaseButton from './buttons/IncreaseButton';
import PauseButton from './buttons/PauseButton';

const TimeControls = () => {
  return (
    <>
      <div className="pointer-events-auto mt-2 flex w-40 flex-row justify-center self-center ">
        <PauseButton />
      </div>
      <div className="pointer-events-auto my-2 flex w-60 flex-row items-center justify-center self-center">
        <DecreaseButton />
        <div className="mx-2">
          <TimescaleSlider />
        </div>
        <IncreaseButton />
      </div>
    </>
  );
};

export default TimeControls;
