import { createContext, type PropsWithChildren } from 'react';
import { useInterpret } from '@xstate/react';
import { toggleMachine } from './toggle-machine/toggle-machine';
import { type InterpreterFrom } from 'xstate';

export const GlobalStateContext = createContext({
  trajectoryVis: {} as InterpreterFrom<typeof toggleMachine>,
  annotationVis: {} as InterpreterFrom<typeof toggleMachine>,
  markerVis: {} as InterpreterFrom<typeof toggleMachine>,
  velArrowVis: {} as InterpreterFrom<typeof toggleMachine>,
});

export const MachineProviders = ({ children }: PropsWithChildren) => {
  const trajectoryVis = useInterpret(toggleMachine);
  const annotationVis = useInterpret(toggleMachine);
  const markerVis = useInterpret(toggleMachine);
  const velArrowVis = useInterpret(toggleMachine);

  const globalServices = {
    trajectoryVis,
    annotationVis,
    markerVis,
    velArrowVis,
  };
  return (
    <GlobalStateContext.Provider value={globalServices}>
      {children}
    </GlobalStateContext.Provider>
  );
};
