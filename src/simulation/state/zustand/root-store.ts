import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

type State = {
  trajectoryThickness: number;
};

type Actions = {
  setTrajectoryThickness: (thickness: number) => void;
};

const initialState: State = {
  trajectoryThickness: 1.5,
};

type RootStore = State & Actions;

export const useRootStore = create<RootStore>()(
  subscribeWithSelector((set, get) => ({
    // Initial state:
    ...initialState,

    // Actions:
    setTrajectoryThickness: (thickness: number) => {
      if (thickness < 0.1) return;
      set({ trajectoryThickness: thickness });
    },
  }))
);
