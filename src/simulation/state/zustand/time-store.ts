import { create } from 'zustand';
import { clamp } from 'lodash';
import { subscribeWithSelector } from 'zustand/middleware';
import { addSeconds } from 'date-fns';
import { DAY } from '@/simulation/utils/constants';

// J2000 epoch
export const J2000 = new Date(2000, 0, 1, 12, 0, 0, 0);

// import { create } from 'zustand';
type State = {
  isPaused: boolean;

  timeElapsed: number;
  timescale: number;
  refDate: Date;
};
type Actions = {
  incrementTimescale: (val?: number) => void;
  decrementTimescale: (val?: number) => void;
  setTimescale: (val: number) => void;

  pause: () => void;
  unpause: () => void;

  addTimeToClock: (delta: number) => void;
  getCurrentDate: () => Date; // Computes date based on timeElapsed relative to refDate

  reset: () => void;
};

const initialState: State = {
  isPaused: true,
  timeElapsed: 0,
  timescale: 1,
  refDate: J2000,
};

type TimeStore = State & Actions;

export const useTimeStore = create<TimeStore>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    incrementTimescale: (val = 1) => {
      const newTimescale = get().timescale + val;
      set({ timescale: Math.min(newTimescale, 100) });
    },
    decrementTimescale: (val = 1) => {
      const newTimescale = get().timescale - val;
      set({ timescale: Math.max(newTimescale, 1) });
    },
    setTimescale: (val: number) => {
      set({ timescale: clamp(val, 0, 100) });
    },

    pause: () => {
      set({ isPaused: true });
    },
    unpause: () => {
      set({ isPaused: false });
    },

    addTimeToClock: (deltaTime: number) => {
      if (deltaTime < 0) {
        return;
      }
      set({ timeElapsed: get().timeElapsed + deltaTime });
    },

    // computes the current date based on the timeElapsed relative to the start date (refDate)
    getCurrentDate: () => {
      return addSeconds(get().refDate, get().timeElapsed * DAY);
    },

    reset: () => {
      set(initialState);
    },
  }))
);

// log changes to state
// const unsubTimescale = useTimeStore.subscribe(
//   (state) => state.timescale,
//   (timescale) => console.log(timescale)
// );

// const unsubPause = useTimeStore.subscribe(
//   (state) => state.isPaused,
//   (isPaused) => console.log('is paused?:', isPaused)
// );
