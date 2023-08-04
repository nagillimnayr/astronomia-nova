import { RootStore } from '@/state/mobx/root/root-store';
import { RootStoreContext } from '@/state/mobx/root/root-store-context';
import { rootMachine } from '@/state/xstate/root-machine/root-machine';
import { useInterpret } from '@xstate/react';
import { useMemo, type PropsWithChildren } from 'react';

// Context provider to make RootStore consumable anywhere in the component tree.
const RootStoreProvider = ({ children }: PropsWithChildren) => {
  // useInterpret is necessary to make sure that the machines are stopped when the component dismounts.
  const rootStore = useMemo(() => new RootStore(), []);
  return (
    <RootStoreContext.Provider value={rootStore}>
      {children}
    </RootStoreContext.Provider>
  );
};

export { RootStoreProvider };
