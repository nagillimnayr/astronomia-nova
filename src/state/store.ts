import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

// store for global state related to the site as a whole

type State = {
  sidebarOpen: boolean;
};
type Actions = {
  toggleSidebar: () => void;
};

const initialState: State = {
  sidebarOpen: false,
};

type Store = State & Actions;

export const useStore = create<Store>()(
  subscribeWithSelector(
    devtools((set, get) => ({
      ...initialState,

      toggleSidebar: () => {
        set({ sidebarOpen: !get().sidebarOpen });
      },
    }))
  )
);
