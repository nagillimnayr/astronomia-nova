import { degToRad } from 'three/src/math/MathUtils';
import { SpaceCamera } from './SpaceCamera';
import { SurfaceCamera } from './SurfaceCamera';
import { CameraControls } from '@react-three/drei';
import { useContext, useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { BaseInstance, Object3DNode, extend } from '@react-three/fiber';
import { CameraController } from '@/lib/camera-controller/CameraController';
import { PI_OVER_TWO } from '@/simulation/utils/constants';

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
        ref={(controller) => {
          if (!controller) return;
          controllerRef.current = controller;
          cameraActor.send({ type: 'ASSIGN_CONTROLS', controls: controller });
          controller.setPolarAngle(PI_OVER_TWO);
          controller.setRadius(1e3);
        }}
      />
      <SpaceCamera />
      <SurfaceCamera />
    </>
  );
};
