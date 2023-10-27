import { CameraController } from '@/components/canvas/scene/camera-controller/CameraController';
import { FAR_CLIP, NEAR_CLIP } from '@/constants/scene-constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { extend, type Object3DNode, useThree } from '@react-three/fiber';
import { useLayoutEffect, useRef } from 'react';
import { PerspectiveCamera } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const startRadius = 2e11;
const startPolar = degToRad(75);
const startAzimuth = 0;

extend({ CameraController });
declare module '@react-three/fiber' {
  interface ThreeElements {
    cameraController: Object3DNode<CameraController, typeof CameraController>;
  }
}

export const CameraManager = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const controllerRef = useRef<CameraController>(null!);
  const getThree = useThree(({ get }) => get);

  useLayoutEffect(() => {
    if (!controllerRef.current) return;
    const { camera } = getThree();

    cameraActor.send({
      type: 'ASSIGN_CONTROLS',
      controls: controllerRef.current,
    });

    if (camera instanceof PerspectiveCamera) {
      // Initialize camera.
      camera.name = 'main-camera';
      camera.near = NEAR_CLIP;
      camera.far = FAR_CLIP;
      cameraActor.send({
        type: 'ASSIGN_CAMERA',
        camera,
      });
    }
  }, [cameraActor, getThree]);

  return (
    <>
      <cameraController
        args={[undefined, startRadius, startAzimuth, startPolar]}
        ref={controllerRef}
      />
    </>
  );
};
