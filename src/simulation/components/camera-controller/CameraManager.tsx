import { degToRad } from 'three/src/math/MathUtils';
import { MainCamera } from './MainCamera';
import {
  CameraControls,
  PerspectiveCamera as PerspectiveCam,
} from '@react-three/drei';
import { useContext, useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { Object3DNode, extend, useThree } from '@react-three/fiber';
import { CameraController } from '@/lib/camera-controller/CameraController';
import { PI_OVER_THREE, PI_OVER_TWO } from '@/simulation/utils/constants';
import {
  ImmersiveSessionOrigin,
  NonImmersiveCamera,
} from '@coconut-xr/natuerlich/react';
import { Group, PerspectiveCamera } from 'three';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { Controllers } from '@coconut-xr/natuerlich/defaults';
import { useSelector } from '@xstate/react';
import { VRSessionOrigin } from '@/components/canvas/vr/VRSessionOrigin';

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
          controllerRef.current = controller;
          cameraActor.send({ type: 'ASSIGN_CONTROLS', controls: controller });
        }}
      />
      <MainCamera />
    </>
  );
};
