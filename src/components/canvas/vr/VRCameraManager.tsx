import { CameraController } from '@/lib/camera-controller/CameraController';
import {
  PI,
  PI_OVER_THREE,
  PI_OVER_TWO,
  Z_AXIS_NEG,
} from '@/simulation/utils/constants';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type Object3DNode, extend, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import {
  type Vector3Tuple,
  PerspectiveCamera,
  Group,
  Vector3,
  Scene,
} from 'three';
import { PerspectiveCamera as PerspectiveCam } from '@react-three/drei';
import {
  ImmersiveSessionOrigin,
  NonImmersiveCamera,
} from '@coconut-xr/natuerlich/react';

import { Controllers } from '@coconut-xr/natuerlich/defaults';
import { useSelector } from '@xstate/react';
import { VRStats } from './VRStats';

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

      {/* <VRMainCamera /> */}
    </>
  );
};

const VRMainCamera = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  return (
    <>
      <PerspectiveCam
        makeDefault
        ref={(camera) => {
          if (!(camera instanceof PerspectiveCamera)) return;

          camera.name = 'main-camera';

          cameraActor.send({
            type: 'ASSIGN_CAMERA',
            camera,
          });
        }}
        position={[0, 0, 0]}
      >
        <VRStats />
      </PerspectiveCam>

      {/* <VRImmersiveOrigin />
      <VRNonImmersiveCam /> */}
    </>
  );
};

const VRNonImmersiveCam = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  const getThree = useThree(({ get }) => get);

  // Bind to state changes so the camera will reset itself when a session starts or ends.
  const vrActive = useSelector(vrActor, (state) => state.matches('active'));

  return (
    <>
      <NonImmersiveCamera
        ref={(camera) => {
          if (!camera) return;
          camera.name = 'main-camera';

          setTimeout(() => {
            cameraActor.send({
              type: 'ASSIGN_CAMERA',
              camera,
            });
          }, 50);
        }}
        position={[0, 0, 0]}
      >
        {/* <arrowHelper
        ref={(arrow) => {
          if (!arrow) return;
          const controls = cameraActor.getSnapshot()!.context.controls;
          if (!controls) return;

          controls.attachToController(arrow);
          arrow.position.set(0, -0.01, 0);
          controls.getCameraWorldPosition(_camWorldPos);
          _arrowDir.set(0, 0, 0);
          arrow.worldToLocal(_arrowDir);
          arrow.setDirection(_arrowDir);
          arrow.setColor('white');
          const length = 5;
          arrow.setLength(3, 0.1 * length, 0.01 * length);
        }}
      /> */}
      </NonImmersiveCamera>
    </>
  );
};

const VRImmersiveOrigin = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);
  const playerRef = useRef<Group>(null!);
  return (
    <>
      <ImmersiveSessionOrigin
        position={[0, 0, 0]}
        ref={(player) => {
          if (!player) return;
          playerRef.current = player;

          const controls = cameraActor.getSnapshot()!.context.controls;
          if (!controls) return;

          controls.attachToController(player);

          console.log('Attaching VR immersive origin to camera!', player);
          player.rotation.set(0, 0, 0);
        }}
      >
        <Controllers />
      </ImmersiveSessionOrigin>
    </>
  );
};
