import Simulation from '@/simulation/components/Simulation';

import { type PropsWithChildren, useContext, useEffect } from 'react';

import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useThree } from '@react-three/fiber';
import { CameraController } from '@/simulation/components/camera-controller/CameraController';
import { useKeyPressed } from '@react-hooks-library/core';

const Scene = ({ children }: PropsWithChildren) => {
  const { cameraService, uiService } = useContext(GlobalStateContext);
  const getThree = useThree(({ get }) => get);

  useEffect(() => {
    // const scene = getThree().scene;
    cameraService.send({ type: 'ASSIGN_THREE', get: getThree });
  }, [cameraService, getThree]);

  useKeyPressed(' ', () => {
    const { camera, controls } = getThree();
    console.log('camera:', camera);
    console.log('controls:', controls);
  });
  return (
    <>
      <CameraController />
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
