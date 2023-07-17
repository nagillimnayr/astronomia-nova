import { RootStore } from '@/state/mobx/root/root-store';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { type PropsWithChildren } from 'react';

// Context provider to make RootStore consumable anywhere in the component tree.
const RootStoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <RootStoreContext.Provider value={new RootStore()}>
      {children}
    </RootStoreContext.Provider>
  );
};

export { RootStoreProvider };
