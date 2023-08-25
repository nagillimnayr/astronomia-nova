import { degToRad } from 'three/src/math/MathUtils';
import { MainCamera } from './MainCamera';

import { useContext, useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Object3DNode, extend, useThree } from '@react-three/fiber';
import { CameraController } from '@/lib/camera-controller/CameraController';

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

  return (
    <>
      <cameraController
        args={[undefined, startRadius, startAzimuth, startPolar]}
        ref={(controller) => {
          if (!controller) return;
          if (controllerRef.current === controller) return;
          controllerRef.current = controller;
          cameraActor.send({ type: 'ASSIGN_CONTROLS', controls: controller });
        }}
      />
      <MainCamera />
    </>
  );
};
