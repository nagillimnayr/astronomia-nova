import type KeplerBody from '@/simulation/classes/KeplerBody';
import { makeFixedUpdateFn } from '@/simulation/systems/FixedTimeStep';
import { traverseKeplerTree } from '@/simulation/systems/keplerTree';
import { DAY } from '@/simulation/utils/constants';
import { type MutableRefObject } from 'react';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

type State = {
  rootRef: MutableRefObject<KeplerBody>;
};

type Actions = {
  updateSim: (deltaTime: number) => void;
};

const initialState: State = {
  rootRef: null!,
};

type SimStore = State & Actions;

const updateSim = makeFixedUpdateFn((timeStep: number) => {
  traverseKeplerTree(useSimStore.getState().rootRef.current, timeStep * DAY);
}, 60);

// this store
export const useSimStore = create<SimStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      ...initialState,

      updateSim: updateSim,
    }))
  )
);
