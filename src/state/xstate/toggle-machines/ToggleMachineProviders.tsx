import { type PropsWithChildren } from 'react';
import {
  AnnotationVisMachineContext,
  MarkerVisMachineContext,
  TrajectoryVisMachineContext,
} from './toggle-machines';

export const ToggleMachineProviders = ({ children }: PropsWithChildren) => {
  return (
    <TrajectoryVisMachineContext.Provider>
      <AnnotationVisMachineContext.Provider>
        <MarkerVisMachineContext.Provider>
          {children}
        </MarkerVisMachineContext.Provider>
      </AnnotationVisMachineContext.Provider>
    </TrajectoryVisMachineContext.Provider>
  );
};
