import { Slider } from '@/components/gui/Slider';
import { TimescaleSlider } from './TimescaleSlider';

import PauseButton from './PauseButton';
import Icon from '@mdi/react';
import { mdiMenuLeft, mdiMenuRight } from '@mdi/js';
import { useTimeStore } from '@/simulation/state/zustand/time-store';
import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useContext } from 'react';
import { useSelector } from '@xstate/react';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';

const TimeControls = () => {
  const rootStore = useContext(RootStoreContext);
  const rootActor = rootStore.rootMachine;
  const timeActor = useSelector(rootActor, ({ context }) => context.timeActor);
  // get state without subscribing
  // const { incrementTimescale, decrementTimescale } = useTimeStore.getState();
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="pointer-events-auto mt-2 flex aspect-square w-fit flex-row justify-center self-center rounded-full border-none bg-gray-400/20 transition-colors hover:bg-gray-400/30">
        <PauseButton />
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
