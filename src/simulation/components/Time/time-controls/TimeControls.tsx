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

const TimeControls = () => {
  const rootActor = MachineContext.useActorRef();
  const { timeActor, cameraActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const focusTarget = useSelector(
    cameraActor,
    ({ context }) => context.focusTarget
  );

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="pointer-events-auto mt-2 flex  w-fit flex-row items-center justify-center gap-2 self-center rounded-full border-none bg-gray-400/20 transition-colors hover:bg-gray-400/30">
        <button
          className="inline-flex h-fit w-fit items-center justify-center rounded-full border-2 bg-subtle p-1 transition-colors hover:bg-slate-700"
          onClick={() => {
            // Advance time by the sidereal rotation period of the reference body. This way, the body will maintain its orientation relative to the fixed stars.
            if (!(focusTarget instanceof KeplerBody)) return;
            rootActor.send({
              type: 'ADVANCE_TIME',
              deltaTime: -focusTarget.siderealRotationPeriod,
            });
          }}
        >
          <span className="icon-[mdi--clock-minus-outline] inline-flex items-center justify-center text-2xl" />
        </button>
        <PauseButton />
        <button
          className="inline-flex h-fit w-fit items-center justify-center rounded-full border-2 bg-subtle p-1 transition-colors hover:bg-slate-700"
          onClick={() => {
            // Advance time by the sidereal rotation period of the reference body. This way, the body will maintain its orientation relative to the fixed stars.
            if (!(focusTarget instanceof KeplerBody)) return;
            rootActor.send({
              type: 'ADVANCE_TIME',
              deltaTime: focusTarget.siderealRotationPeriod,
            });
          }}
        >
          <span className="icon-[mdi--clock-plus-outline] inline-flex items-center justify-center text-2xl" />
        </button>
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
