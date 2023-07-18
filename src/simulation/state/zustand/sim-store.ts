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
  updateSim: (root: KeplerBody, deltaTime: number) => void;
};

const initialState: State = {
  rootRef: null!,
};

type SimStore = State & Actions;

const updateSim = makeFixedUpdateFn<KeplerBody>(
  (root: KeplerBody, timeStep: number) => {
    traverseKeplerTree(root, timeStep * DAY);
  },
  60
);

// this store
export const useSimStore = create<SimStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      ...initialState,

      updateSim: updateSim,
    }))
  )
);
