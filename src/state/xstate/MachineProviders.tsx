import { createContext, type PropsWithChildren } from 'react';
import { createActorContext, useInterpret } from '@xstate/react';
import { type InterpreterFrom } from 'xstate';
// import { cameraMachine } from './camera-machine/camera-machine';
// import { selectionMachine } from './selection-machine/selection-machine';
// import { uiMachine } from './ui-machine/ui-machine';

// import { visibilityMachine } from './visibility-machine/visibility-machine';
import { rootMachine } from './root-machine/root-machine';

export const MachineContext = createActorContext(rootMachine, {
  id: 'rootActor',
});

// export const GlobalStateContext = createContext({
//   // Root machine:
//   rootActor: {} as InterpreterFrom<typeof rootMachine>,

//   // Visibility machine:
//   visibilityService: {} as InterpreterFrom<typeof visibilityMachine>,

//   // UI machine:
//   uiService: {} as InterpreterFrom<typeof uiMachine>,

//   // Camera machine:
//   cameraService: {} as InterpreterFrom<typeof cameraMachine>,

//   // Selection machine:
//   selectionService: {} as InterpreterFrom<typeof selectionMachine>,
// });

export const MachineProviders = ({ children }: PropsWithChildren) => {
  return (
    // <GlobalStateContext.Provider value={globalServices}>
    <MachineContext.Provider>{children}</MachineContext.Provider>
    // </GlobalStateContext.Provider>
  );
};
