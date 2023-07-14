import { RootState } from '@react-three/fiber';
import { create } from 'zustand';

type State = {
  getThree: () => RootState;
};

const useStore = create<State>()((set, get) => ({
  //
}));

// transient updates for frequent state changes
