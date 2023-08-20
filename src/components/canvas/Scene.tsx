import Simulation from '@/simulation/components/Simulation';

import { type PropsWithChildren } from 'react';

import { CameraManager } from '@/simulation/components/camera-controller/CameraManager';

const Scene = ({ children }: PropsWithChildren) => {
  return (
    <>
      <CameraManager />
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
