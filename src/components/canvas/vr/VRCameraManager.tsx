import { CameraController } from '@/lib/camera-controller/CameraController';
import { MainCamera } from '@/simulation/components/camera-controller/MainCamera';
import { PI_OVER_THREE, PI_OVER_TWO } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Object3DNode, extend } from '@react-three/fiber';
import { useRef } from 'react';

extend({ CameraController });
declare module '@react-three/fiber' {
  interface ThreeElements {
    cameraController: Object3DNode<CameraController, typeof CameraController>;
  }
}
export const VRCameraManager = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const controllerRef = useRef<CameraController>(null!);
  return (
    <>
      <cameraController
        ref={(controller) => {
          if (!controller) return;
          controllerRef.current = controller;
          cameraActor.send({ type: 'ASSIGN_CONTROLS', controls: controller });
          controller.setMinRadius(0.1);
          // controller.setPolarAngle(PI_OVER_THREE);
          controller.translateY(1);
          controller.setTargetRadius(8);
        }}
      />
      <MainCamera />
    </>
  );
};
