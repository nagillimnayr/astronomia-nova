import { create } from 'zustand';

type State = {};

const useStore = create<State>()((set, get) => ({
  //
}));

// transient updates for frequent state changes
