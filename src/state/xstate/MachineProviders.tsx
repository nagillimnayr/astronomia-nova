import { createActorContext } from '@xstate/react';
import { type PropsWithChildren } from 'react';

import { rootMachine } from './root-machine/root-machine';

export const MachineContext = createActorContext(rootMachine, {
  id: 'rootActor',
});

export const MachineProviders = ({ children }: PropsWithChildren) => {
  return <MachineContext.Provider>{children}</MachineContext.Provider>;
};
