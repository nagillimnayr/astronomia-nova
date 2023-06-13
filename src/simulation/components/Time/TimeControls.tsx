import BackwardButton from './buttons/BackwardButton';
import ForwardButton from './buttons/ForwardButton';
import PauseButton from './buttons/PauseButton';

const TimeControls = () => {
  return (
    <div className="flex flex-row justify-between ">
      <BackwardButton />
      <PauseButton />
      <ForwardButton />
    </div>
  );
};

export default TimeControls;
