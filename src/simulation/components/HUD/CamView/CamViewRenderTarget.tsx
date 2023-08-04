import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  Billboard,
  Box,
  Plane,
  RenderTexture,
  useFBO,
} from '@react-three/drei';
import { createPortal, useFrame } from '@react-three/fiber';
import { useSelector } from '@xstate/react';
import { useContext, useMemo } from 'react';
import { Scene } from 'three';

const CamViewRenderTarget = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const surfaceCamera = useSelector(
    cameraActor,
    (state) => state.context.surfaceCamera
  );
  const getThree = useSelector(cameraActor, (state) => state.context.getThree);

  const renderTarget = useFBO(window.innerWidth / 4, window.innerHeight / 4);

  useFrame(({ gl }) => {
    if (!surfaceCamera || !getThree) return;
    gl.autoClear = true;
    const scene = getThree().scene;
    gl.setRenderTarget(renderTarget);
    gl.render(scene, surfaceCamera);
    gl.setRenderTarget(null);
  });

  const aspect = window.innerWidth / window.innerHeight;
  const size = 14;

  // if (!surfaceCamera) return;
  return (
    <>
      <Plane args={[size, size / aspect, 1]} position={[-20, 10, 0]}>
        <meshBasicMaterial map={renderTarget.texture} />
      </Plane>
    </>
  );
};

export { CamViewRenderTarget };
