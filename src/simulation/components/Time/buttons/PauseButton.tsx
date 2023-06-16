import {
  PlayIcon,
  PauseIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';
import { useThree } from '@react-three/fiber';
import { Play, Pause, PlayCircle, PauseCircle } from 'lucide-react';
import { useCallback, useContext, useState } from 'react';
import IconButton from '~/components/IconButton';
import { timeState } from '~/simulation/state/TimeState';

const PauseButton = () => {
  //const { timescaleDisplayRef, timescaleRef } = useContext(TimeContext);

  const [isPaused, setPaused] = useState<boolean>(true);

  //const clock = useThree((state) => state.clock);

  const pause = useCallback(() => {
    timeState.pause();
    setPaused(true);
  }, []);
  const unpause = useCallback(() => {
    timeState.unpause();
    setPaused(false);
  }, []);

  return (
    <IconButton
      onClick={(e) => {
        console.log('pause/play:', isPaused);
        console.log('timeState:', timeState);
        e.stopPropagation();
        isPaused ? unpause() : pause();
      }}
    >
      {isPaused ? <Play /> : <Pause />}
    </IconButton>
  );
};

export default PauseButton;
