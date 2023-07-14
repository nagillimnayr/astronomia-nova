import {
  PlayIcon,
  PauseIcon,
  PlayCircleIcon,
  PauseCircleIcon,
} from '@heroicons/react/24/solid';
import { useThree } from '@react-three/fiber';

import { Play, Pause, PlayCircle, PauseCircle } from 'lucide-react';
import { useCallback, useContext, useState } from 'react';
import IconButton from '@/components/IconButton';
import { timeState } from '@/simulation/state/TimeState';
import Icon from '@mdi/react';
import { mdiPlay, mdiPause } from '@mdi/js';
import { useTimeStore } from '@/simulation/state/zustand/time-store';

const PauseButton = () => {
  // const [isPaused, setPaused] = useState<boolean>(true);

  // get isPaused from external store and subscribe to changes
  const isPaused = useTimeStore((state) => state.isPaused);
  const pause = useTimeStore((state) => state.pause);
  const unpause = useTimeStore((state) => state.unpause);

  // const pause = useCallback(() => {
  //   timeState.pause();
  //   // setPaused(true);
  // }, []);
  // const unpause = useCallback(() => {
  //   timeState.unpause();
  //   // setPaused(false);
  // }, []);

  return (
    <button
      className="bg-translucent btn-icon box-content p-1 "
      onClick={(e) => {
        e.stopPropagation();
        isPaused ? unpause() : pause();
      }}
    >
      <Icon path={isPaused ? mdiPlay : mdiPause} size={1.5} />
    </button>
  );
};

export default PauseButton;
