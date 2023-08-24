import { useSelector } from '@xstate/react';
import { useContext, useEffect, useRef } from 'react';
import { MachineContext } from '@/state/xstate/MachineProviders';
import { PerspectiveCamera } from 'three';
import { DIST_MULT, SUN_RADIUS } from '@/simulation/utils/constants';
import { FAR_CLIP, NEAR_CLIP } from '@/components/canvas/scene-constants';
import { NonImmersiveCamera } from '@coconut-xr/natuerlich/react';
import { PerspectiveCamera as PerspectiveCam } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

export const MainCamera = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );
  // const camera = useThree(({ camera }) => camera);

  // Name for identifying the camera.
  const name = 'main-camera';

  // Bind to state changes so the camera will reset itself when a session starts or ends.
  const vrActive = useSelector(vrActor, (state) => state.matches('active'));

  return (
    <>
      <PerspectiveCam
        makeDefault
        name={name}
        near={NEAR_CLIP}
        far={FAR_CLIP}
        ref={(camera) => {
          if (camera instanceof PerspectiveCamera) {
            // Send camera to cameraActor.
            cameraActor.send({ type: 'ASSIGN_CAMERA', camera });
          }
        }}
      ></PerspectiveCam>
    </>
  );
};

const MainNonImmersiveCamera = () => {
  const { cameraActor, vrActor } = MachineContext.useSelector(
    ({ context }) => context
  );

  // Bind to state changes so the camera will reset itself when a session starts or ends.
  const vrActive = useSelector(vrActor, (state) => state.matches('active'));

  return (
    <>
      <NonImmersiveCamera
        name="main-camera"
        position={[0, 0, 0]}
        near={NEAR_CLIP}
        far={FAR_CLIP}
        ref={(camera) => {
          if (!camera) return;

          setTimeout(() => {
            cameraActor.send({
              type: 'ASSIGN_CAMERA',
              camera,
            });
          }, 50);
        }}
      ></NonImmersiveCamera>
    </>
  );
};
