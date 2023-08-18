import { CameraController } from '@/lib/camera-controller/CameraController';
import { SpaceCamera } from '@/simulation/components/camera-controller/SpaceCamera';
import { PI_OVER_TWO } from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { useRef } from 'react';

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
          controller.setPolarAngle(PI_OVER_TWO);
          controller.setRadius(8);
        }}
      />
      <SpaceCamera />
    </>
  );
};
