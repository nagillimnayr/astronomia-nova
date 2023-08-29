import { degToRad } from 'three/src/math/MathUtils';
import { MainCamera } from './MainCamera';

import { useContext, useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Object3DNode, extend, useThree } from '@react-three/fiber';
import { CameraController } from '@/lib/camera-controller/CameraController';
import { PerspectiveCamera } from 'three';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';

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
          console.log('CameraManager:', controller);
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
      {/* <MainCamera /> */}
      {/* <CameraLogger /> */}
    </>
  );
};

const CameraLogger = () => {
  const camera = useThree(({ camera }) => camera);

  console.log('useThree().camera:', camera);

  return (
    <>
      <></>
    </>
  );
};
