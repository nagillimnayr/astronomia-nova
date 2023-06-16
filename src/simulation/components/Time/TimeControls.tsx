import BackwardButton from './buttons/BackwardButton';
import ForwardButton from './buttons/ForwardButton';
import PauseButton from './buttons/PauseButton';

const TimeControls = () => {
  return (
    <div className="mt-2 flex w-40 flex-row justify-between self-center">
      <BackwardButton />
      <PauseButton />
      <ForwardButton />
    </div>
  );
};

export default TimeControls;
