import { degToRad } from 'three/src/math/MathUtils';
import { MainCamera } from './MainCamera';
import { CameraControls } from '@react-three/drei';
import { useContext, useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import {
  BaseInstance,
  Object3DNode,
  extend,
  useThree,
} from '@react-three/fiber';
import { CameraController } from '@/lib/camera-controller/CameraController';
import { PI_OVER_TWO } from '@/simulation/utils/constants';
import {
  ImmersiveSessionOrigin,
  NonImmersiveCamera,
} from '@coconut-xr/natuerlich/react';
import { Group, PerspectiveCamera } from 'three';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { Controllers } from '@coconut-xr/natuerlich/defaults';

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
      <VRMainCamera />
    </>
  );
};

const VRMainCamera = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  const getThree = useThree(({ get }) => get);

  const cameraRef = useRef<PerspectiveCamera>(null!);

  return (
    <>
      <VRImmersiveOrigin />
      <NonImmersiveCamera
        ref={(camera) => {
          if (!camera) return;
          camera.name = 'non-immersive-camera';
          getThree().set({ camera });

          setTimeout(() => {
            cameraActor.send({
              type: 'ASSIGN_CAMERA',
              camera,
            });
          }, 300);
        }}
        position={[0, 0, 0]}
        near={NEAR_CLIP}
        far={FAR_CLIP}
      ></NonImmersiveCamera>
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
