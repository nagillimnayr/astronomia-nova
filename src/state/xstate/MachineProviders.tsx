import { createContext, type PropsWithChildren } from 'react';
import { useInterpret } from '@xstate/react';
import { toggleMachine } from './toggle-machine/toggle-machine';
import { type InterpreterFrom } from 'xstate';
import { cameraMachine } from './camera-machine/camera-machine';
import { selectionMachine } from './selection-machine/selection-machine';

export const GlobalStateContext = createContext({
  // Toggle machines:
  trajectoryVis: {} as InterpreterFrom<typeof toggleMachine>,
  annotationVis: {} as InterpreterFrom<typeof toggleMachine>,
  markerVis: {} as InterpreterFrom<typeof toggleMachine>,
  velArrowVis: {} as InterpreterFrom<typeof toggleMachine>,

  // Camera machine:
  cameraService: {} as InterpreterFrom<typeof cameraMachine>,

  // Selection machine:
  selectionService: {} as InterpreterFrom<typeof selectionMachine>,
});

export const MachineProviders = ({ children }: PropsWithChildren) => {
  // Toggle machines:
  const trajectoryVis = useInterpret(toggleMachine);
  const annotationVis = useInterpret(toggleMachine);
  const markerVis = useInterpret(toggleMachine);
  const velArrowVis = useInterpret(toggleMachine);

  // Camera machine:
  const cameraService = useInterpret(cameraMachine);

  // Selection machine:
  const selectionService = useInterpret(selectionMachine);

  const globalServices = {
    // Toggle machines:
    trajectoryVis,
    annotationVis,
    markerVis,
    velArrowVis,

    // Camera machine:
    cameraService,

    // Selection machine:
    selectionService,
  };
  return (
    <GlobalStateContext.Provider value={globalServices}>
      {children}
    </GlobalStateContext.Provider>
  );
};
