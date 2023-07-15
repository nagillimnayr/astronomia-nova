import type KeplerBody from '@/simulation/classes/KeplerBody';
import { makeFixedUpdateFn } from '@/simulation/systems/FixedTimeStep';
import { traverseKeplerTree } from '@/simulation/systems/keplerTree';
import { DAY } from '@/simulation/utils/constants';
import { type MutableRefObject } from 'react';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

type State = {
  selected: KeplerBody | null;
};

type Actions = {
  select: (newSelection: KeplerBody) => void;
  deselect: () => void;
};

const initialState: State = {
  selected: null,
};

type SimStore = State & Actions;

export const useSelectionStore = create<SimStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      ...initialState,

      select: (newSelection: KeplerBody) => {
        set({ selected: newSelection });
      },
      deselect: () => {
        set({ selected: null });
      },
    }))
  )
);
