import { useRef, type PropsWithChildren, useEffect } from 'react';
import { createActorContext } from '@xstate/react';

import { rootMachine } from './root-machine/root-machine';

export const MachineContext = createActorContext(rootMachine, {
  id: 'rootActor',
});

export const MachineProviders = ({ children }: PropsWithChildren) => {
  return (
    <MachineContext.Provider>
      <Initializer />
      {children}
    </MachineContext.Provider>
  );
};

const Initializer = () => {
  const { uiActor } = MachineContext.useSelector(({ context }) => context);
  // Create refs and assign them to global state.
  const screenPortalRef = useRef<HTMLDivElement>(null!);
  useEffect(() => {
    uiActor.send({ type: 'ASSIGN_SCREEN_PORTAL_REF', screenPortalRef });
  }, [uiActor]);

  return <></>;
};
