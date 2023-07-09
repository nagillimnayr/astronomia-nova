import { proxy } from 'valtio';
import { DAY } from '../utils/constants';
import { addSeconds } from 'date-fns';
import { simState } from '@/simulation/state/SimState';
import { Clock } from 'three';

const j2000 = new Date(2000, 0, 1, 12, 0, 0, 0);

type TimeStateObj = {
  //clock: Clock; // internal clock, separate from the three state clock so that the camera controls can still move while paused
  isPaused: boolean;
  timeElapsed: number;
  timescale: number;
  refDate: Date;
  date: Date;

  incrementTimescale: (val?: number) => void;
  decrementTimescale: (val?: number) => void;
  setTimescale: (val: number) => void;
  pause: () => void;
  unpause: () => void;

  updateClock: (delta: number) => void;
};

const incrementTimescale = (val = 1) => {
  timeState.timescale = Math.min(timeState.timescale + val, 100);
};
const decrementTimescale = (val = 1) => {
  timeState.timescale = Math.max(timeState.timescale - val, 0);
};
const setTimescale = (val: number) => {
  // clamp value
  timeState.timescale = Math.min(100, Math.max(0, val));
};

const pause = () => {
  console.log('pause');
  //timeState.clock.stop();
  timeState.isPaused = true;
  console.log('clock running: ', simState.getState().clock.running);
};
const unpause = () => {
  console.log('unpause');
  //timeState.clock.start();
  timeState.isPaused = false;
  console.log('clock running: ', simState.getState().clock.running);
};

const updateClock = (scaledDelta: number) => {
  // increase time elapsed by scaled delta time
  timeState.timeElapsed += scaledDelta * DAY;

  // get date relative to J2000 epoch
  timeState.date = addSeconds(j2000, timeState.timeElapsed);
};

export const timeState = proxy<TimeStateObj>({
  //clock: new Clock(true),
  isPaused: true,
  timeElapsed: 0,
  timescale: 1,
  refDate: j2000,
  date: j2000,

  incrementTimescale,
  decrementTimescale,
  setTimescale,
  pause,
  unpause,

  updateClock,
});
