import Simulation from '@/simulation/components/Simulation';

import { type PropsWithChildren, useContext, useEffect } from 'react';

import { CameraManager } from '@/simulation/components/camera-controller/CameraManager';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useThree } from '@react-three/fiber';

const Scene = ({ children }: PropsWithChildren) => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const getThree = useThree(({ get }) => get);
  useEffect(() => {
    cameraActor.send({ type: 'ASSIGN_GET_THREE', getThree });
  }, [cameraActor, getThree]);
  return (
    <>
      <CameraManager />
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
