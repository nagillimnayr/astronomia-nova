import { createContext, type PropsWithChildren } from 'react';
import { useInterpret } from '@xstate/react';
import { toggleMachine } from './toggle-machine';
import { type InterpreterFrom } from 'xstate';

export const TrajectoryVisContext = createContext(
  {} as InterpreterFrom<typeof toggleMachine>
);
export const AnnotationVisContext = createContext(
  {} as InterpreterFrom<typeof toggleMachine>
);
export const MarkerVisContext = createContext(
  {} as InterpreterFrom<typeof toggleMachine>
);

export const ToggleMachineProviders = ({ children }: PropsWithChildren) => {
  const trajectoryVis = useInterpret(toggleMachine);
  const annotationVis = useInterpret(toggleMachine);
  const markerVis = useInterpret(toggleMachine);
  return (
    <TrajectoryVisContext.Provider value={trajectoryVis}>
      <AnnotationVisContext.Provider value={annotationVis}>
        <MarkerVisContext.Provider value={markerVis}>
          {children}
        </MarkerVisContext.Provider>
      </AnnotationVisContext.Provider>
    </TrajectoryVisContext.Provider>
  );
};
