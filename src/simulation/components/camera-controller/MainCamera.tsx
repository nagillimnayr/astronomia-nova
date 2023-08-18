import {
  CameraControls,
  PerspectiveCamera as PerspectiveCam,
} from '@react-three/drei';
import { degToRad } from 'three/src/math/MathUtils';
import { useSelector } from '@xstate/react';
import { useContext, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { type PerspectiveCamera } from 'three';
import { DIST_MULT, SUN_RADIUS } from '@/simulation/utils/constants';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';

export const MainCamera = () => {
  const { cameraActor } = MachineContext.useSelector(({ context }) => context);

  const cameraRef = useRef<PerspectiveCamera>(null!);

  return (
    <>
      <PerspectiveCam
        makeDefault
        name="main-camera"
        ref={(cam) => {
          if (!cam) return;
          const camera = cam as PerspectiveCamera;
          cameraRef.current = camera;

          // Assign camera to state context.
          cameraActor.send({
            type: 'ASSIGN_CAMERA',
            camera,
          });
        }}
        position={[0, 0, 0]}
        near={NEAR_CLIP}
        far={FAR_CLIP}
      />
    </>
  );
};
