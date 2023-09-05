import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

type State = {
  trajectoryThickness: number;
  trajectoryColor: boolean;
};

type Actions = {
  setTrajectoryThickness: (thickness: number) => void;
  setTrajectoryColor: (color: boolean) => void;
};

const initialState: State = {
  trajectoryThickness: 2,
  trajectoryColor: false,
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
    setTrajectoryColor: (color) => {
      set({ trajectoryColor: color });
    },
  }))
);
