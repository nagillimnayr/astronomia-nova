import { MouseEventHandler } from 'react';
import BackwardButton from './buttons/BackwardButton';
import ForwardButton from './buttons/ForwardButton';
import PauseButton from './buttons/PauseButton';
import { Clock } from 'three';

type ControlsProps = {
  decrementFn?: MouseEventHandler<HTMLButtonElement>;
  incrementFn?: MouseEventHandler<HTMLButtonElement>;
  togglePauseFn?: MouseEventHandler<HTMLButtonElement>;
  getClock: () => Clock;
};
const TimeControls = (props: ControlsProps) => {
  return (
    <div className="flex flex-row justify-between ">
      <BackwardButton />
      <PauseButton getClock={props.getClock} />
      <ForwardButton />
    </div>
  );
};

export default TimeControls;
