import { type KeplerOrbit } from '@/components/canvas/orbit';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

type State = {
  trajectoryThickness: number;
  trajectoryColor: boolean;
  orbitMap: Map<string, KeplerOrbit>;
};

type Actions = {
  setTrajectoryThickness: (thickness: number) => void;
  setTrajectoryColor: (color: boolean) => void;
  addOrbit: (orbit: KeplerOrbit) => void;
};

const initialState: State = {
  trajectoryThickness: 2,
  trajectoryColor: false,
  orbitMap: new Map<string, KeplerOrbit>(),
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

    addOrbit: (orbit: KeplerOrbit) => {
      const orbitMap = get().orbitMap;
      if (orbitMap.has(orbit.name)) return;
      // Create new map.
      const newOrbitMap = new Map<string, KeplerOrbit>(orbitMap);
      newOrbitMap.set(orbit.name, orbit);
      set({ orbitMap: newOrbitMap });
    },
  }))
);
