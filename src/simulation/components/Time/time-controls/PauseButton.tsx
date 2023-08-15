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
import { MachineContext } from '@/state/xstate/MachineProviders';
import { timeMachine } from '../../../../state/xstate/time-machine/time-machine';
import { useSelector } from '@xstate/react';
import { cn } from '@/lib/cn';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { ClassNameValue } from 'tailwind-merge';

type Props = {
  className?: ClassNameValue;
};
const PauseButton = ({ className }: Props) => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  // Check whether paused or not.
  const isPaused = useSelector(timeActor, (state) => state.matches('paused'));

  return (
    <button
      className={cn(
        'inline-flex aspect-square items-center justify-center rounded-full p-1',
        className
      )}
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
