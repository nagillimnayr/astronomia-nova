import { degToRad } from 'three/src/math/MathUtils';
import { useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { extend, type Object3DNode, useThree } from '@react-three/fiber';
import { CameraController } from '@/components/canvas/scene/camera-controller/CameraController';
import { PerspectiveCamera } from 'three';
import { FAR_CLIP, NEAR_CLIP } from '@/constants/scene-constants';

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
  const camRef = useRef<PerspectiveCamera>(null!);
  const getThree = useThree(({ get }) => get);

  return (
    <>
      <cameraController
        args={[undefined, startRadius, startAzimuth, startPolar]}
        ref={(controller) => {
          if (!controller) return;
          if (controllerRef.current === controller) return;
          controllerRef.current = controller;
          const { camera } = getThree();

          cameraActor.send({ type: 'ASSIGN_CONTROLS', controls: controller });

          if (camRef.current === camera) return;
          if (camera instanceof PerspectiveCamera) {
            camRef.current = camera;
            // Initialize camera.
            camera.name = 'main-camera';
            camera.near = NEAR_CLIP;
            camera.far = FAR_CLIP;
            cameraActor.send({
              type: 'ASSIGN_CAMERA',
              camera,
            });
          }
        }}
      />
    </>
  );
};
