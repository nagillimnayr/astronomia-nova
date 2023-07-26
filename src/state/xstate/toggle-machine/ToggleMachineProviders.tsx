import { createContext, type PropsWithChildren } from 'react';
import { useInterpret } from '@xstate/react';
import { toggleMachine } from './toggle-machine';
import { type InterpreterFrom } from 'xstate';

// Trajectory visibility.
export const TrajectoryVisContext = createContext(
  {} as InterpreterFrom<typeof toggleMachine>
);
// Annotation visibility.
export const AnnotationVisContext = createContext(
  {} as InterpreterFrom<typeof toggleMachine>
);

// Marker visibility.
export const MarkerVisContext = createContext(
  {} as InterpreterFrom<typeof toggleMachine>
);

// Velocity arrow visibility.
export const VelArrowContext = createContext(
  {} as InterpreterFrom<typeof toggleMachine>
);

export const ToggleMachineProviders = ({ children }: PropsWithChildren) => {
  const trajectoryVis = useInterpret(toggleMachine);
  const annotationVis = useInterpret(toggleMachine);
  const markerVis = useInterpret(toggleMachine);
  const velArrowVis = useInterpret(toggleMachine);
  return (
    <TrajectoryVisContext.Provider value={trajectoryVis}>
      <AnnotationVisContext.Provider value={annotationVis}>
        <MarkerVisContext.Provider value={markerVis}>
          <VelArrowContext.Provider value={velArrowVis}>
            {children}
          </VelArrowContext.Provider>
        </MarkerVisContext.Provider>
      </AnnotationVisContext.Provider>
    </TrajectoryVisContext.Provider>
  );
};
