import { StateCreator } from 'zustand';
import { clamp } from 'lodash';

// J2000 epoch
const J2000 = new Date(2000, 0, 1, 12, 0, 0, 0);

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
    reset: () => void;
};

const initialState: State = {
    isPaused: true,
    timeElapsed: 0,
    timescale: 1,
    refDate: J2000,
};

type TimeSlice = State & Actions;

export const createTimeSlice: StateCreator<TimeSlice, [], [], TimeSlice> = (
    set,
    get
) => ({
    ...initialState,

    incrementTimescale: (val?: number) => {
        const newTimescale = get().timescale + (val ?? 1);
        set({ timescale: Math.max(newTimescale, 100) });
    },
    decrementTimescale: (val?: number) => {
        const newTimescale = get().timescale - (val ?? 1);
        set({ timescale: Math.min(newTimescale, 1) });
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
    reset: () => {
        set(initialState);
    },
});