import {
  PlayIcon,
  PauseIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';
import { useThree } from '@react-three/fiber';
import { Play, Pause, PlayCircle, PauseCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { Clock } from 'three';
import IconButton from '~/components/IconButton';
import { TimeContext } from '~/simulation/context/TimeContext';

type PauseBtnProps = {
  getClock: () => Clock;
};
const PauseButton = (props: PauseBtnProps) => {
  //const { timescaleDisplayRef, timescaleRef } = useContext(TimeContext);

  const [isPaused, setPaused] = useState<boolean>(true);

  //const clock = useThree((state) => state.clock);

  const pause = () => {
    const clock = props.getClock();
    clock.stop();
    setPaused(true);
  };
  const unpause = () => {
    const clock = props.getClock();
    clock.start();
    setPaused(false);
  };

  const handleClick = () => {
    isPaused ? unpause() : pause();
  };

  return (
    <IconButton onClick={handleClick}>
      {isPaused ? <Play /> : <Pause />}
    </IconButton>
  );
};

export default PauseButton;
