import { Slider } from '@/components/gui/slider/Slider';
import { TimescaleSlider } from './TimescaleSlider';

import PauseButton from './PauseButton';
import Icon from '@mdi/react';
import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useContext } from 'react';
import { useSelector } from '@xstate/react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { DAY, HOUR, TIME_MULT } from '@/simulation/utils/constants';
import KeplerBody from '@/simulation/classes/kepler-body';
import { AdvanceTimeButton } from './AdvanceTimeButton';

const TimeControls = () => {
  const { timeActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="border-none/30 pointer-events-auto mt-2  flex w-fit flex-row items-center justify-center gap-2 self-center rounded-full">
        <AdvanceTimeButton
          reverse
          className={
            'w-8 bg-gray-400/20 text-3xl transition-colors hover:bg-gray-500/50'
          }
        />
        <PauseButton
          className={
            'w-8 bg-gray-400/20 text-3xl transition-colors hover:bg-gray-500/50'
          }
        />
        <AdvanceTimeButton
          className={
            'w-8 bg-gray-400/20 text-3xl transition-colors hover:bg-gray-500/50'
          }
        />
      </div>

      <div className="pointer-events-auto my-2 box-content flex w-48 min-w-fit flex-row items-center justify-center self-center rounded-full  bg-gray-400/20  px-1 py-1">
        <button
          className="m-0 inline-flex aspect-square w-6 items-center justify-center rounded-full p-0"
          onClick={(e) => {
            e.stopPropagation();
            timeActor.send({ type: 'DECREMENT_TIMESCALE' });
          }}
        >
          <span
            className={'icon-[mdi--menu-left] h-full w-full rounded-full'}
          />
        </button>

        <div className="mx-2 max-w-fit">
          <TimescaleSlider />
        </div>

        <button
          className="m-0 inline-flex aspect-square w-6 items-center justify-center rounded-full p-0"
          onClick={(e) => {
            e.stopPropagation();
            timeActor.send({ type: 'INCREMENT_TIMESCALE' });
          }}
        >
          <span
            className={'icon-[mdi--menu-right] h-full w-full rounded-full'}
          />
        </button>
      </div>
    </div>
  );
};

export default TimeControls;
