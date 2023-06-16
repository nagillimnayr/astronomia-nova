import { proxy } from 'valtio';

type TimeStateObj = {
  timeElapsed: number;
  timescale: number;

  incrementTimescale: (val: number) => void;
  decrementTimescale: (val: number) => void;
};

const incrementTimescale = (val = 1) => {
  timeState.timescale = Math.min(timeState.timescale + val, 100);
};
const decrementTimescale = (val = 1) => {
  timeState.timescale = Math.max(timeState.timescale - val, 0);
};
export const timeState = proxy<TimeStateObj>({
  timeElapsed: 0,
  timescale: 1,
  incrementTimescale,
  decrementTimescale,
});
