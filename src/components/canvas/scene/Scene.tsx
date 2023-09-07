import { CameraManager } from '@/components/canvas/scene/camera-controller/CameraManager';
import Simulation from '@/components/canvas/simulation/Simulation';

import { type PropsWithChildren } from 'react';

const Scene = ({ children }: PropsWithChildren) => {
  return (
    <>
      <CameraManager />
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
