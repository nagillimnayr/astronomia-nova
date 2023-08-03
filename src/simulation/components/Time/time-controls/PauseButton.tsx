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
import Icon from '@mdi/react';
import { mdiPlay, mdiPause } from '@mdi/js';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { timeMachine } from '../../../../state/xstate/time-machine/time-machine';
import { useSelector } from '@xstate/react';
import { cn } from '@/lib/cn';

const PauseButton = () => {
  const { rootActor } = useContext(GlobalStateContext);
  const timeActor = useSelector(rootActor, ({ context }) => context.timeActor);
  // Check whether paused or not.
  const isPaused = useSelector(timeActor, (state) => state.matches('paused'));

  return (
    <button
      className="inline-flex aspect-square w-8 items-center justify-center rounded-full border-2 border-white p-1"
      onClick={(e) => {
        e.stopPropagation();

        timeActor.send(isPaused ? 'UNPAUSE' : 'PAUSE');
      }}
    >
      <span
        className={cn(
          'h-full w-full rounded-full',
          isPaused ? 'icon-[mdi--play]' : 'icon-[mdi--pause]'
        )}
      />
    </button>
  );
};

export default PauseButton;