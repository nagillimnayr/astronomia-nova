import { Slider } from '../GUI/Slider';
import BackwardButton from './buttons/BackwardButton';
import ForwardButton from './buttons/ForwardButton';
import PauseButton from './buttons/PauseButton';

const TimeControls = () => {
  return (
    <>
      <div className="pointer-events-auto mt-2 flex w-40 flex-row justify-between self-center ">
        <BackwardButton />
        <PauseButton />
        <ForwardButton />
      </div>
      <div className="pointer-events-auto my-2 flex w-40 flex-row justify-between self-center ">
        <Slider />
      </div>
    </>
  );
};

export default TimeControls;
