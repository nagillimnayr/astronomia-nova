import { createContext, type PropsWithChildren } from 'react';
import {
  createActorContext,
  useInterpret,
  useActor,
  useSelector,
} from '@xstate/react';
import { toggleMachine } from './toggle-machine/toggle-machine';
import { type InterpreterFrom } from 'xstate';
import { cameraMachine } from './camera-machine/camera-machine';
import { selectionMachine } from './selection-machine/selection-machine';
import { uiMachine } from './ui-machine/ui-machine';

import { inspect } from '@xstate/inspect';
import { visibilityMachine } from './visibility-machine/visibility-machine';
if (typeof window !== 'undefined') {
  inspect({
    iframe: false,
  });
}

// export const RootMachineContext = createActorContext(rootMachine, {
//   devTools: true,
// });

export const GlobalStateContext = createContext({
  // Visibility machine:
  visibilityService: {} as InterpreterFrom<typeof visibilityMachine>,

  // UI machine:
  uiService: {} as InterpreterFrom<typeof uiMachine>,

  // Camera machine:
  cameraService: {} as InterpreterFrom<typeof cameraMachine>,

  // Selection machine:
  selectionService: {} as InterpreterFrom<typeof selectionMachine>,
});

export const MachineProviders = ({ children }: PropsWithChildren) => {
  // Visibility machine:
  const visibilityService = useInterpret(visibilityMachine);
  // visibilityService.start();

  // UI machine:
  const uiService = useInterpret(uiMachine);

  // Camera machine:
  const cameraService = useInterpret(cameraMachine);

  // Selection machine:
  const selectionService = useInterpret(selectionMachine);

  const globalServices = {
    // Visibility machine:
    visibilityService,

    // UI machine:
    uiService,

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
