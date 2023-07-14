import KeplerBody from '@/simulation/classes/KeplerBody';
import { makeFixedUpdateFn } from '@/simulation/systems/FixedTimeStep';
import { traverseKeplerTree } from '@/simulation/systems/keplerTree';
import { DAY } from '@/simulation/utils/constants';
import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

type State = {
  selected: KeplerBody | null;
  root: KeplerBody;
};

type Actions = {
  updateSim: (deltaTime: number) => void;
  select: (newSelection: KeplerBody) => void;
  deselect: () => void;
};

const initialState: State = {
  selected: null,
  root: null!,
};

type SimStore = State & Actions;
export const useSimStore = create<SimStore>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      ...initialState,

      updateSim: makeFixedUpdateFn((timeStep: number) => {
        traverseKeplerTree(get().root, timeStep * DAY);
      }, 60),

      select: (newSelection: KeplerBody) => {
        set({ selected: newSelection });
      },
      deselect: () => {
        set({ selected: null });
      },
    }))
  )
);

const updateSim = () => {
  useSimStore.getState();
};
