import Simulation from '@/simulation/components/Simulation';

import { type PropsWithChildren, useContext, useEffect } from 'react';

import { MachineContext } from '@/state/xstate/MachineProviders';
import { useThree } from '@react-three/fiber';
import { CameraController } from '@/simulation/components/camera-controller/CameraController';
import { useKeyPressed } from '@react-hooks-library/core';

const Scene = ({ children }: PropsWithChildren) => {
  const { cameraActor, uiActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const getThree = useThree(({ get }) => get);

  useEffect(() => {
    // const scene = getThree().scene;
    cameraActor.send({ type: 'ASSIGN_THREE', get: getThree });
  }, [cameraActor, getThree]);

  return (
    <>
      <CameraController />
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
