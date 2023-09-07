import { CameraController } from '@/components/canvas/scene/camera-controller/CameraController';

import { MachineContext } from '@/state/xstate/MachineProviders';
import { extend, type Object3DNode, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { PerspectiveCamera, Vector3, type Vector3Tuple } from 'three';
import { degToRad } from 'three/src/math/MathUtils';

const _camWorldPos = new Vector3();
const _arrowDir = new Vector3();

extend({ CameraController });
declare module '@react-three/fiber' {
  interface ThreeElements {
    cameraController: Object3DNode<CameraController, typeof CameraController>;
  }
}

type VRCameraManagerProps = {
  position?: Vector3Tuple;
};
export const VRCameraManager = ({
  position = [0, 0, 0],
}: VRCameraManagerProps) => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  const controllerRef = useRef<CameraController>(null!);
  const camRef = useRef<PerspectiveCamera>(null!);
  const getThree = useThree(({ get }) => get);

  return (
    <>
      <cameraController
        position={position}
        ref={(controller) => {
          if (!controller) return;
          if (controllerRef.current === controller) return;
          controllerRef.current = controller;
          const { camera } = getThree();

          cameraActor.send({ type: 'ASSIGN_CONTROLS', controls: controller });
          controller.setMinRadius(0.01);
          controller.setTargetRadius(8);
          controller.setPolarAngleTarget(degToRad(75));

          if (camRef.current === camera) return;
          if (camera instanceof PerspectiveCamera) {
            camRef.current = camera;
            // Initialize camera.
            camera.name = 'main-camera';
            // camera.near = NEAR_CLIP;
            // camera.far = FAR_CLIP;
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
