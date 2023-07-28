import Simulation from '@/simulation/components/Simulation';

import { type PropsWithChildren, Suspense, useContext, useRef } from 'react';
import { LoadingFallback } from '../LoadingFallback';

import { GlobalStateContext } from '@/state/xstate/MachineProviders';

const Scene = ({ children }: PropsWithChildren) => {
  const { cameraService, uiService } = useContext(GlobalStateContext);
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Simulation>{children}</Simulation>
    </Suspense>
  );
};

export default Scene;
