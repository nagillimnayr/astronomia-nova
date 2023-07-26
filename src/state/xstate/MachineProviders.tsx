import { createContext, type PropsWithChildren } from 'react';
import { useInterpret } from '@xstate/react';
import { toggleMachine } from './toggle-machine/toggle-machine';
import { type InterpreterFrom } from 'xstate';
import { cameraMachine } from './camera-machine/camera-machine';

export const GlobalStateContext = createContext({
  // Toggle machines.
  trajectoryVis: {} as InterpreterFrom<typeof toggleMachine>,
  annotationVis: {} as InterpreterFrom<typeof toggleMachine>,
  markerVis: {} as InterpreterFrom<typeof toggleMachine>,
  velArrowVis: {} as InterpreterFrom<typeof toggleMachine>,
  cameraService: {} as InterpreterFrom<typeof cameraMachine>,
});

export const MachineProviders = ({ children }: PropsWithChildren) => {
  // Toggle machines.
  const trajectoryVis = useInterpret(toggleMachine);
  const annotationVis = useInterpret(toggleMachine);
  const markerVis = useInterpret(toggleMachine);
  const velArrowVis = useInterpret(toggleMachine);

  // Camera machine.
  const cameraService = useInterpret(cameraMachine);

  const globalServices = {
    // Toggle machines.
    trajectoryVis,
    annotationVis,
    markerVis,
    velArrowVis,
    cameraService,
  };
  return (
    <GlobalStateContext.Provider value={globalServices}>
      {children}
    </GlobalStateContext.Provider>
  );
};
