import { RootStore } from '@/state/mobx/root/root-store';
import { type PropsWithChildren, createContext } from 'react';

const RootStoreContext = createContext<RootStore>(null!);

// Context provider to make RootStore consumable anywhere in the component tree.
const RootStoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      {children}
    </RootStoreContext.Provider>
  );
};

export default RootStoreProvider;
