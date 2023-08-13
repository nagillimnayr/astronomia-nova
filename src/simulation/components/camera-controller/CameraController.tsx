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

const MIN_POLAR_ANGLE: Readonly<number> = degToRad(1);
const MAX_POLAR_ANGLE: Readonly<number> = degToRad(179);

export const CameraManager = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const controllerRef = useRef<CameraController>(null!);

  return (
    <>
      {/* <CameraControls
        makeDefault={true}
        minDistance={1e-5}
        polarAngle={degToRad(60)}
        minPolarAngle={MIN_POLAR_ANGLE}
        maxPolarAngle={MAX_POLAR_ANGLE}
        ref={(controls) => {
          if (!controls) {
            return;
          }

          console.assert(
            '__r3f' in controls,
            'Error: controls are not of type BaseInstance'
          );
          // Assign controls context in camera state machine.
          cameraActor.send({
            type: 'ASSIGN_CONTROLS',
            controls: controls as unknown as CameraControls & BaseInstance,
          });
        }}
      ></CameraControls> */}
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
