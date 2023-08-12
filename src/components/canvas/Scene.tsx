import Simulation from '@/simulation/components/Simulation';

import { type PropsWithChildren, useContext, useEffect } from 'react';

import { CameraController } from '@/simulation/components/camera-controller/CameraController';

const Scene = ({ children }: PropsWithChildren) => {
  return (
    <>
      <CameraController />
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
