import Simulation from '@/simulation/components/Simulation';

import {
  type PropsWithChildren,
  Suspense,
  useContext,
  useRef,
  useEffect,
} from 'react';
import { LoadingFallback } from '../LoadingFallback';

import { GlobalStateContext } from '@/state/xstate/MachineProviders';
import { useFrame, useThree } from '@react-three/fiber';

const Scene = ({ children }: PropsWithChildren) => {
  const { cameraService, uiService } = useContext(GlobalStateContext);
  const getThree = useThree(({ get }) => get);
  // useFrame(({ gl, camera, scene }) => {
  //   gl.render(scene, camera);
  // });
  useEffect(() => {
    const scene = getThree().scene;
    cameraService.send({ type: 'ASSIGN_SCENE', scene });
  }, [cameraService, getThree]);
  return (
    <>
      <Simulation>{children}</Simulation>
    </>
  );
};

export default Scene;
